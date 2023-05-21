const Airtable = require("airtable");
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_TOKEN }).base(
  process.env.AIRTABLE_BASE_TOKEN
);

const table = base("Projects");

const getMinifiedRecords = (records) =>
  records.map((item) => ({ ...item.fields, recordId: item.id }));

const findRecordByFilter = async (id) => {
  const foundCoffeeStore = await table
    .select({ filterByFormula: `id="${id}"` })
    .firstPage();

  return getMinifiedRecords(foundCoffeeStore);
};

export { table, getMinifiedRecords, findRecordByFilter };
