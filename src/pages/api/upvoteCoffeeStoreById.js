import { findRecordByFilter, getMinifiedRecords, table } from "@/lib/airtable";

async function httpUpvoteStore(req, res) {
  try {
    if (req.method === "PUT") {
      const { id } = req.body;
      if (!id) return res.status(400).json({ error: "ID is missing" });

      const records = await findRecordByFilter(id);

      if (records.length !== 0) {
        const record = records[0];
        const upgratedVote = parseInt(record.voting) + 1;
        const upvotedStore = await table.update([
          { id: record.recordId, fields: { voting: upgratedVote } },
        ]);
        return res.json(getMinifiedRecords(upvotedStore));
      } else {
        return res.status(404).json({ error: "Store could not be found" });
      }
    } else {
      res.status(400).json({ error: "Unexpected http verb" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}

export default httpUpvoteStore;
