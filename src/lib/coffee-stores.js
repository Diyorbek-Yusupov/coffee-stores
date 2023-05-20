import { createApi } from "unsplash-js";

const unsplashApi = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
});

export function getUrlForCoffeeStores(query, latLong, limit) {
  return `https://api.foursquare.com/v3/places/search?query=${query}&ll=${latLong}&limit=${limit}`;
}

async function getCoffeStorePhotos() {
  const photos = await unsplashApi.search.getPhotos({
    query: "coffee store",

    perPage: 40,

    orientation: "landscape",
  });

  return photos.response.results.map((photoItem) => photoItem.urls.small);
}

export async function fetchCoffeeStores(
  latLong = "43.67071473533954,-79.37580642600865", limit = 6
) {
  const coffeStoreImages = await getCoffeStorePhotos();
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY,
    },
  };
  const response = await fetch(
    getUrlForCoffeeStores("coffee stores", latLong, limit),
    options
  ).then((res) => res.json());

  return response.results.map((store, index) => ({
    ...store,
    imgUrl: coffeStoreImages[index],
  }));
}
