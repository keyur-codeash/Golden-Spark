import { useShopByCallection } from "@/forntend/context/ShopBycallection";
import React from "react";
import { useRouter } from "next/navigation";
const CardCommon = ({ item }) => {
  const { shopBy, setShopBy } = useShopByCallection();
  const router = useRouter();

  const handleCallection = (id) => {
    setShopBy(id);
    router.push("/product");
  };

  return (
    <div
      className={`px-3 xl:px-7 `}
      onClick={() => handleCallection(item.brand_id)}
    >
      <div className="h-[246px]">
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
