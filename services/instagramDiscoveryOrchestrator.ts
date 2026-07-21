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
  const sessionId = crypto.randomUUID();
  await db.collection("discovery_sessions").doc(sessionId).set({
    sessionId,
    userId,
    niche,
    maxProfiles,
    maxPosts,
    maxComments,
    startedAt: new Date().toISOString(),
    status: "running",
    totalLeads: 0
  });

  onProgress({
    step: "discovering_profiles",
    status: "running",
    taskId: sessionId,
    data: { message: `Searching for "${niche}" profiles (up to ${maxProfiles})...` }
  });

  try {
    const profiles = await discoverProfilesByNiche(niche, maxProfiles);
    onProgress({
      step: "profiles_found",
      status: "running",
      taskId: sessionId,
      data: { message: `Found ${profiles.length} profiles`, count: profiles.length }
    });

    let totalLeads = 0;

    for (const [i, profile] of profiles.entries()) {
      const username = profile.username || profile.ownerUsername;
      if (!username) continue;

      onProgress({
        step: "processing_profile",
        status: "running",
        taskId: sessionId,
        data: {
          message: `Profile ${i + 1}/${profiles.length}: @${username}`,
          profile: username,
          index: i,
          total: profiles.length
        }
      });

      const profileData = {
        username,
        followerCount: profile.followersCount || profile.followers || null,
        postCount: profile.postsCount || profile.posts || null,
        bio: profile.biography || profile.bio || "",
        profileUrl: `https://www.instagram.com/${username}/`,
        processedAt: new Date().toISOString(),
        status: "processing"
      };

      await db.collection("discovery_sessions").doc(sessionId)
        .collection("profiles").doc(username).set(profileData);

      onProgress({
        step: "profile_updated",
        status: "running",
        taskId: sessionId,
        data: { profile: profileData }
      });

      const posts = await getProfilePosts(username, maxPosts);

      for (const [j, post] of posts.entries()) {
        const postUrl = post.url || post.link || `https://www.instagram.com/p/${post.shortCode || post.shortcode}/`;
        const shortcode = post.shortCode || post.shortcode || postUrl.match(/\/p\/([^\/]+)/)?.[1] || `post_${j}`;

        try {
          const comments = await getPostComments(postUrl, maxComments);

          await db.collection("discovery_sessions").doc(sessionId)
            .collection("profiles").doc(username)
            .collection("posts").doc(shortcode).set({
              postUrl,
              fetchedAt: new Date().toISOString(),
              commentCount: comments.length,
            });

          for (const comment of comments) {
            const leadData = {
              username: comment.username,
              commentText: comment.text,
              profileUrl: comment.profileUrl,
              stage: "new",
              sourceNiche: niche,
              sourceProfile: username,
              sourcePost: postUrl,
              discoveredAt: new Date().toISOString(),
            };

            await db.collection("discovery_sessions").doc(sessionId)
              .collection("profiles").doc(username)
              .collection("posts").doc(shortcode)
              .collection("leads").doc(comment.username).set(leadData);

            // Also add to a top-level collection for easier querying if needed, or structured sub-collection
            totalLeads++;
          }

          onProgress({
            step: "comments_fetched",
            status: "running",
            taskId: sessionId,
            data: {
              message: `@${username}, post ${j + 1}/${posts.length}: ${comments.length} leads`,
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

          // Update current leads count on session
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

      // Mark profile as processed
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
