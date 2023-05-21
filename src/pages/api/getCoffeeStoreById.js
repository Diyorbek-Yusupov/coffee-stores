import { findRecordByFilter, getMinifiedRecords, table } from "@/lib/airtable";

async function httpGetCoffeStore(req, res) {
  try {
    const { id } = req.query;
    if (!id) throw new Error("ID is missing");

    const record = await findRecordByFilter(id);

    if (record.length !== 0) {
      return res.json(record);
    } else {
      return res.status(404).json({ error: "Store could not be found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: `Error with get store: ${error.message}` });
  }
}

export default httpGetCoffeStore;
