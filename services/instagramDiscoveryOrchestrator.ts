import crypto from 'crypto';
import { db } from '../firebase-client-wrapper';
import {
  discoverProfilesByNiche,
  getProfilePosts,
  getPostComments
} from './apifyClient';

export async function runDiscoverySession(
  niche: string,
  userId: string,
  onProgress: (update: any) => void,
  maxProfiles: number,
  maxPosts: number,
  maxComments: number
) {
  const boundedMaxProfiles = Math.min(Math.max(maxProfiles || 5, 1), 50);
  const boundedMaxPosts = Math.min(Math.max(maxPosts || 3, 1), 20);
  const boundedMaxComments = Math.min(Math.max(maxComments || 10, 1), 50);

  const sessionId = crypto.randomUUID();
  await db.collection("discovery_sessions").doc(sessionId).set({
    sessionId,
    userId,
    niche,
    maxProfiles: boundedMaxProfiles,
    maxPosts: boundedMaxPosts,
    maxComments: boundedMaxComments,
    startedAt: new Date().toISOString(),
    status: "running",
    profilesCount: 0,
    totalLeads: 0
  });

  onProgress({
    step: "discovering_profiles",
    status: "running",
    taskId: sessionId,
    data: { message: `Searching for "${niche}" profiles via apidojo/instagram-user-scraper (up to ${boundedMaxProfiles})...` }
  });

  try {
    const profiles = await discoverProfilesByNiche(niche, boundedMaxProfiles);

    await db.collection("discovery_sessions").doc(sessionId).update({
      profilesCount: profiles.length
    });

    onProgress({
      step: "profiles_found",
      status: "running",
      taskId: sessionId,
      data: {
        message: `Found ${profiles.length} profiles for "${niche}"`,
        count: profiles.length,
        profiles: profiles.map(p => ({
          username: p.username,
          fullName: p.fullName,
          followers: p.followersCount,
          posts: p.postsCount,
          bio: p.biography,
          categoryName: p.categoryName,
          isBusinessAccount: p.isBusinessAccount
        }))
      }
    });

    // Immediately pre-save all discovered profiles into the session
    for (const p of profiles) {
      if (!p.username) continue;
      await db.collection("discovery_sessions").doc(sessionId)
        .collection("profiles").doc(p.username).set({
          username: p.username,
          fullName: p.fullName || "",
          followers: p.followersCount || 0,
          posts: p.postsCount || 0,
          bio: p.biography || "",
          categoryName: p.categoryName || "",
          isBusinessAccount: Boolean(p.isBusinessAccount),
          profileUrl: `https://www.instagram.com/${p.username}/`,
          status: "discovered",
          discoveredAt: new Date().toISOString()
        }, { merge: true });
    }

    let totalLeads = 0;

    for (const [i, profile] of profiles.entries()) {
      const username = profile.username;
      if (!username) continue;

      onProgress({
        step: "processing_profile",
        status: "running",
        taskId: sessionId,
        data: {
          message: `Scraping posts for profile ${i + 1}/${profiles.length}: @${username}`,
          profile: username,
          index: i,
          total: profiles.length
        }
      });

      const profileData = {
        username,
        fullName: profile.fullName || "",
        followers: profile.followersCount || 0,
        posts: profile.postsCount || 0,
        bio: profile.biography || "",
        categoryName: profile.categoryName || "",
        isBusinessAccount: Boolean(profile.isBusinessAccount),
        profileUrl: `https://www.instagram.com/${username}/`,
        processedAt: new Date().toISOString(),
        status: "processing"
      };

      await db.collection("discovery_sessions").doc(sessionId)
        .collection("profiles").doc(username).set(profileData, { merge: true });

      onProgress({
        step: "profile_updated",
        status: "running",
        taskId: sessionId,
        data: { profile: profileData }
      });

      const posts = await getProfilePosts(username, boundedMaxPosts);

      for (const [j, post] of posts.entries()) {
        const postUrl = post.url || post.link || `https://www.instagram.com/p/${post.shortCode || post.shortcode}/`;
        const shortcode = post.shortCode || post.shortcode || postUrl.match(/\/p\/([^\/]+)/)?.[1] || `post_${j}`;

        try {
          const comments = await getPostComments(postUrl, boundedMaxComments);

          await db.collection("discovery_sessions").doc(sessionId)
            .collection("profiles").doc(username)
            .collection("posts").doc(shortcode).set({
              postUrl,
              likesCount: post.likesCount || post.likes || 0,
              commentsCount: post.commentsCount || comments.length,
              fetchedAt: new Date().toISOString(),
              commentCount: comments.length,
            }, { merge: true });

          for (const comment of comments) {
            if (!comment.username) continue;
            const leadData = {
              username: comment.username,
              commentText: comment.text,
              profileUrl: comment.profileUrl,
              stage: "Discovered",
              sourceNiche: niche,
              sourceProfile: username,
              sourcePost: postUrl,
              discoveredAt: new Date().toISOString(),
            };

            await db.collection("discovery_sessions").doc(sessionId)
              .collection("profiles").doc(username)
              .collection("posts").doc(shortcode)
              .collection("leads").doc(comment.username).set(leadData, { merge: true });

            totalLeads++;
          }

          onProgress({
            step: "comments_fetched",
            status: "running",
            taskId: sessionId,
            data: {
              message: `@${username}, post ${j + 1}/${posts.length}: ${comments.length} leads extracted`,
              profile: username,
              postUrl,
              shortcode,
              commentsCount: comments.length,
              leads: comments.map(c => ({
                username: c.username,
                commentText: c.text,
                profileUrl: c.profileUrl,
                discoveredAt: new Date().toISOString()
              }))
            }
          });

          await db.collection("discovery_sessions").doc(sessionId).update({
            totalLeads
          });

        } catch (err: any) {
          onProgress({
            step: "post_error",
            status: "running",
            taskId: sessionId,
            data: { message: `Failed on post @${username}: ${err.message}` }
          });
        }
      }

      await db.collection("discovery_sessions").doc(sessionId)
        .collection("profiles").doc(username).update({
          status: "processed"
        });
    }

    await db.collection("discovery_sessions").doc(sessionId).update({
      status: "complete",
      completedAt: new Date().toISOString(),
      totalLeads,
    });

    onProgress({
      step: "session_complete",
      status: "done",
      taskId: sessionId,
      data: {
        message: `Done: ${totalLeads} leads from ${profiles.length} profiles`,
        sessionId,
        totalLeads
      }
    });

  } catch (err: any) {
    await db.collection("discovery_sessions").doc(sessionId).update({
      status: "failed",
      error: err.message,
      completedAt: new Date().toISOString()
    });

    onProgress({
      step: "error",
      status: "failed",
      taskId: sessionId,
      data: { message: err.message }
    });
  }
}
