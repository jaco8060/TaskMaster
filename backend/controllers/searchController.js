// backend/controllers/searchController.js
import { meiliClient } from "../meilisearch.js";

export const handleSearch = async (req, res) => {
  const { query } = req.query;
  const userId = req.user.id;
  const organizationId = req.user.organization_id;

  try {
    const userResults = await meiliClient.index("users").search(query, {
      filter: `organization_id = ${organizationId}`,
      limit: 5,
    });
    const ticketResults = await meiliClient.index("tickets").search(query, {
      filter: `(assigned_to = ${userId} OR reported_by = ${userId}) AND organization_id = ${organizationId}`,
      limit: 5,
    });
    const projectResults = await meiliClient.index("projects").search(query, {
      filter: `user_id = ${userId} OR organization_id = ${organizationId}`,
      limit: 5,
    });

    res.json({
      users: userResults.hits.map((hit) => ({
        id: hit.id,
        username: hit.username,
        email: hit.email,
        link: `/view-profile/${hit.id}`,
      })),
      tickets: ticketResults.hits.map((hit) => ({
        id: hit.id,
        title: hit.title,
        description: hit.description,
        link: `/ticket-details/${hit.id}`,
      })),
      projects: projectResults.hits.map((hit) => ({
        id: hit.id,
        name: hit.name,
        description: hit.description,
        link: `/project-details/${hit.id}`,
      })),
    });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: "Failed to perform search" });
  }
};
