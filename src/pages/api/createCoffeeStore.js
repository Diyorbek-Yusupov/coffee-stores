import { table, getMinifiedRecords, findRecordByFilter } from "@/lib/airtable";

async function httpCreateCoffeStore(req, res) {
  const { id, name, address, region, voting, imgUrl, timezone } = req.body;

  if (!id || !name) {
    return res.status(400).json({ error: "Missing required properties" });
  }
  try {
    const record = await findRecordByFilter(id);

    if (record.length !== 0) {
      res.json(record);
    } else {
      const records = await table.create([
        {
          fields: {
            id,
            name,
            address,
            region,
            voting: voting || 0,
            imgUrl,
            timezone,
          },
        },
      ]);
      res.json(getMinifiedRecords(records));
    }
  } catch (error) {
    console.error("Error with creating a table", error);
    res.status(500).json({ error: "Error with creating a table" });
  }
}

export default httpCreateCoffeStore;
