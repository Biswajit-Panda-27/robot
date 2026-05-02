import { useState, useEffect } from "react"
import { 
  ShoppingCartIcon, 
  ArrowRightIcon, 
  StarIcon, 
  PackageIcon
} from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useNavigate } from "react-router-dom"
import { useCart } from "@/contexts/CartContext"
import { motion, AnimatePresence } from "framer-motion"

const ShopPage = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [products, setProducts] = useState<any[]>([])
  const { addToCart } = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/products`)
        if (!response.ok) throw new Error("Failed to fetch products")
        const data = await response.json()
        setProducts(data)
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchProducts()
  }, [])

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-6 mb-16" data-aos="fade-up">
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-primary">SHOP THE FUTURE.</h1>
        <p className="text-muted-foreground text-lg max-w-2xl">Discover our curated collection of advanced robotics, STEM kits, and high-performance components.</p>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {isLoading ? (
            // Skeleton Loading
            [1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-secondary/20 rounded-[2.5rem] p-8 aspect-[4/5] animate-pulse" />
            ))
          ) : products.length > 0 ? (
            products.map((product) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={product.id}
                className="group relative bg-white border border-black/5 rounded-[2.5rem] p-8 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 flex flex-col h-full"
              >
                <div 
                  onClick={() => navigate(`/product/${product.id}`)}
                  className="aspect-square bg-secondary/20 rounded-3xl mb-6 overflow-hidden cursor-pointer relative"
                >
                  <img 
                    src={product.product_image} 
                    alt={product.product_name} 
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700"
                  />
                  {product.product_discounted_price && (
                    <Badge className="absolute top-4 right-4 bg-destructive text-white border-none">SALE</Badge>
                  )}
                </div>

                <div className="flex flex-col gap-2 flex-grow">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">{product.product_category}</span>
                    <div className="flex items-center gap-1 text-neon-blue">
                      <StarIcon size={12} weight="fill" />
                      <span className="text-[10px] font-bold">{product.product_rating}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-black tracking-tight group-hover:text-primary transition-colors cursor-pointer" onClick={() => navigate(`/product/${product.id}`)}>
                    {product.product_name}
                  </h3>
                  <p className="text-muted-foreground text-xs line-clamp-2 mb-4 leading-relaxed">
                    {product.product_description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-black/5 mt-auto">
                  <div className="flex flex-col">
                    {product.product_discounted_price ? (
                      <>
                        <span className="text-xl font-black text-primary">${product.product_discounted_price}</span>
                        <span className="text-[10px] text-muted-foreground line-through">${product.product_price}</span>
                      </>
                    ) : (
                      <span className="text-xl font-black text-primary">${product.product_price}</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="icon" 
                      variant="secondary"
                      className="rounded-full w-10 h-10 hover:bg-primary hover:text-white transition-all"
                      onClick={() => addToCart(product)}
                    >
                      <ShoppingCartIcon size={18} weight="bold" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="ghost"
                      className="rounded-full w-10 h-10 group/btn"
                      onClick={() => navigate(`/product/${product.id}`)}
                    >
                      <ArrowRightIcon size={18} weight="bold" className="group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-24 text-center">
              <div className="w-24 h-24 bg-secondary/30 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                <PackageIcon size={40} className="text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-black tracking-tighter mb-2">Our shelves are empty.</h3>
              <p className="text-muted-foreground max-w-sm mx-auto">We are currently preparing our next generation of robotics. Check back soon for the latest releases.</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default ShopPage
