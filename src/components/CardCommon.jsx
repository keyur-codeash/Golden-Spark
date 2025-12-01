import { useShopByCallection } from "@/forntend/context/ShopBycallection";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
const CardCommon = ({ item }) => {
  const { shopBy, setShopBy } = useShopByCallection();
  const router = useRouter();

  const handleCallection = (id) => {
    setShopBy(id);
    router.push("/product");
  };

  useEffect(() => {
    return () => setShopBy(null);
  }, []);

  return (
    <div className={`px-3 xl:px-7 `}>
      <div
        className="h-[246px] cursor-pointer"
        onClick={() => handleCallection(item.brand_id)}
      >
        <img
          src={item?.image}
          alt={item?.name}
          className="object-cover w-full h-full rounded-full border-6 border-brown-900"
        />
      </div>
      <p className="text-center py-4 text-xl xl:text-2xl">{item?.name}</p>
    </div>
  );
};

export default CardCommon;
