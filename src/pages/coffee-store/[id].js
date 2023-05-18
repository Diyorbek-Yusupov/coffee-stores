import { useRouter } from "next/router";

const CoffeeStore = () => {
  const router = useRouter();
  return <div>CoffeeStore {router.query.id}</div>;
};

export default CoffeeStore;
