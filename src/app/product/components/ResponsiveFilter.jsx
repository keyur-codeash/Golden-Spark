import React, { useEffect, useState } from "react";
import { HiOutlineX } from "react-icons/hi";
import { TbFilter } from "react-icons/tb";
import ShoppingCard from "@/components/ShoppingCard.jsx";
import Button from "@/components/Button.jsx";
import Pagination from "@/components/Pagination.jsx";
import "aos/dist/aos.css";
import { fetchProducts } from "@/forntend/services/productService.js";
import FilterSidebar from "./Filter";
import { useRouter } from "next/navigation";
import { useWishlist } from "@/forntend/context/WishlistContext";
import useToken from "@/forntend/hooks/useToken";
import SkeletonShoppingCard from "@/forntend/skeleton/ProductsSkeleton";
import { useShopByCallection } from "@/forntend/context/ShopBycallection";

const ResponsiveFilter = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [priceRange, setPriceRange] = useState([0, 0]);
  const [stock, setStock] = useState({ inStock: 0, outStock: 0 });
  const { shopBy } = useShopByCallection();

  const [filters, setFilters] = useState({
    collections: [],
    stock: false,
    outOfStock: false,
    brands: [shopBy],
    sizes: [],
    colors: [],
    minPrice: 0,
    maxPrice: 0,
    isNewArrival: false,
    isBestSelling: false,
    isFeatured: false,
  });
  const { token } = useToken();
  const router = useRouter();
  const { addToWishlist, removeFromWishlist } = useWishlist();

  const buildQueryString = () => {
    const queryParams = [];

    // Handle collections
    if (filters.collections.includes("new-arrivals")) {
      queryParams.push("isNewArrival=true");
    }
    if (filters.collections.includes("best-selling")) {
      queryParams.push("isBestSelling=true");
    }
    if (filters.collections.includes("featured-product")) {
      queryParams.push("isFeatured=true");
    }

    // Handle brands
    if (filters.brands.length > 0) {
      queryParams.push(`brand=${filters.brands.join(",")}`);
    }

    // Handle colors
    if (filters.colors.length > 0) {
      queryParams.push(`color=${filters.colors.join(",")}`);
    }

    // Handle sizes
    if (filters.sizes.length > 0) {
      queryParams.push(`size=${filters.sizes.join(",")}`);
    }

    // Handle availability
    if (filters.stock && !filters.outOfStock) {
      queryParams.push("inStock=true");
    } else if (!filters.stock && filters.outOfStock) {
      queryParams.push("outStock=true");
    } else if (filters.stock && filters.outOfStock) {
      queryParams.push("inStock=true&outStock=true");
    }

    // Handle price range
    if (
      (filters.minPrice > 0 && filters.minPrice != priceRange[0]) ||
      (filters.maxPrice > 0 && filters.maxPrice != priceRange[1])
    ) {
      queryParams.push(`minPrice=${filters.minPrice}`);
      queryParams.push(`maxPrice=${filters.maxPrice}`);
    }

    // Add page number
    queryParams.push(`page=${currentPage}`);

    return queryParams.join("&");
  };

  const getProducts = async () => {
    try {
      setLoading(true);
      const query = buildQueryString();
      const response = await fetchProducts(query, token);

      if (response?.isSuccess) {
        setProducts(response.data);
        setTotalPages(response.totalPages || 1);
        setCurrentPage(response.page);
        setStock(response.stock || { inStock: 0, outStock: 0 });

        if (priceRange[1] === 0 && response.maxPrice > 0) {
          setMinPrice(response.minPrice);
          setMaxPrice(response.maxPrice);
          setPriceRange([response.minPrice, response.maxPrice]);
          setFilters((prev) => ({
            ...prev,
            minPrice: response.minPrice,
            maxPrice: response.maxPrice,
          }));
        }
      } else {
        setProducts([]);
        setLoading(false);
        return;
      }
    } catch (err) {
      console.error("Failed to fetch products", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setCurrentPage(1);
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
  };

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      await getProducts();
    };
    // fetchData();
    const timer = setTimeout(() => {
      fetchData();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 1000);

    return () => clearTimeout(timer);
  }, [currentPage, filters]);

  const handleWishlistUpdate = async (product) => {
    if (product.isWishlist) {
      await removeFromWishlist(product.id);
    } else {
      await addToWishlist(product);
    }
    setProducts((prev) => {
      return prev.map((item) => {
        if (item.id == product.id) {
          return { ...item, isWishlist: !item.isWishlist };
        } else return item;
      });
    });
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-6 lg:pt-10">
        {/* Mobile Filter Button */}
        <div className="mx-4 lg:hidden">
          <Button
            label="Filters"
            icon={<TbFilter className="text-xl" />}
            color="blue"
            size="md"
            variant="solid"
            className="!bg-brown-900 !rounded-0 py-3 mt-5 flex items-center gap-[10px]"
            onClick={() => setIsModalOpen(true)}
          />
        </div>

        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-[300px]">
          <FilterSidebar
            minPrice={minPrice}
            maxPrice={maxPrice}
            setMinPrice={setMinPrice}
            setMaxPrice={setMaxPrice}
            priceRange={priceRange}
            onFilterChange={handleFilterChange}
            selectedFilters={filters}
            stock={stock}
          />
        </div>

        {/* Product Grid */}

        <div className="pb-10 flex-1 px-4 xl:px-0">
          <div className="grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-y-10">
            {loading ? (
              <SkeletonShoppingCard items={8} />
            ) : products.length === 0 ? (
              <p className="p-6 text-lg h-full">
                <div>
                  <h2 className="text-x mb-2">No products found</h2>
                </div>
              </p>
            ) : (
              products.map((item, index) => (
                <ShoppingCard
                  key={index}
                  id={item.id}
                  image={item.images[0]}
                  text={item.title}
                  price={item.price}
                  isWishList={item.isWishlist}
                  onCardUpdateData={() => handleWishlistUpdate(item)}
                />
              ))
            )}
          </div>
        </div>

        {/* Mobile Filter Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 flex justify-start items-start lg:hidden">
            <div className="relative w-[320px] max-w-full bg-brown-500 h-full shadow-lg transform translate-x-0 transition-transform duration-300 ease-in-out">
              <button
                onClick={() => setIsModalOpen(false)}
                className="fixed top-6 right-4 z-50 bg-brown-500 text-xl text-gray-600"
              >
                <HiOutlineX />
              </button>

              <div className="pt-12 pb-6 px-4 overflow-y-auto h-full relative z-40">
                <div data-aos="fade-up">
                  <FilterSidebar
                    minPrice={minPrice}
                    maxPrice={maxPrice}
                    setMinPrice={setMinPrice}
                    setMaxPrice={setMaxPrice}
                    priceRange={priceRange}
                    onFilterChange={handleFilterChange}
                    selectedFilters={filters}
                    stock={stock}
                  />
                </div>
              </div>  
            </div>
          </div>
        )}
      </div>
      {/* Pagination Below Products */}
      {products.length && totalPages > 1 ? (
        <div className="pb-5">
          <div className="p-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => {
                setCurrentPage(page);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default ResponsiveFilter;
