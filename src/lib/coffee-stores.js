import { createApi } from "unsplash-js";

const unsplashApi = createApi({ accessKey: process.env.UNSPLASH_ACCESS_KEY });

export function getUrlForCoffeeStores(query, latLong, limit) {
  return `https://api.foursquare.com/v3/places/search?query=${query}&ll=${latLong}&limit=${limit}`;
}

async function getCoffeStorePhotos() {
  const photos = await unsplashApi.search.getPhotos({
    query: "coffee store",

    perPage: 10,
  
    orientation: "landscape",
  });

  return photos.response.results.map((photoItem) => photoItem.urls.small);
}

export async function fetchCoffeeStores() {
  const coffeStoreImages = await getCoffeStorePhotos();
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: process.env.FOURSQUARE_API_KEY,
    },
  };
  const response = await fetch(
    getUrlForCoffeeStores(
      "coffee stores",
      "41.30855449478699,69.25326449099359",
      6
    ),
    options
  ).then((res) => res.json());

  return response.results.map((store, index) => ({
    ...store,
    imgUrl: coffeStoreImages[index],
  }));
}
