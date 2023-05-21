import { fetchCoffeeStores } from "@/lib/coffee-stores";

async function httpHandler(req, res) {
  try {
    const { latLong, limit } = req.query;
    const nearbyStores = await fetchCoffeeStores(latLong, limit);
    res.status(200).json(nearbyStores);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

export default httpHandler;
