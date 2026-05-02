import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { 
  ShoppingCartIcon, 
  StarIcon, 
  CheckCircleIcon, 
  ArrowLeftIcon,
  ShieldCheckIcon,
  TruckIcon,
  CubeIcon,
  ShieldIcon
} from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/contexts/CartContext"
import { toast } from "react-toastify"

const ProductPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState("")
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true)
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/products/${id}`)
        if (!response.ok) throw new Error("Product not found")
        const data = await response.json()
        setProduct(data)
        setActiveImage(data.product_image)
      } catch (error) {
        console.error("Error fetching product:", error)
        setProduct(null)
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchProduct()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!product) return <div>Product not found</div>

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.product_name,
      price: product.product_discounted_price || product.product_price,
      img: product.product_image
    })
    toast.success("Added to cart!")
  }

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <Button 
        variant="ghost" 
        onClick={() => navigate(-1)} 
        className="mb-8 gap-2 group text-muted-foreground hover:text-primary transition-colors"
      >
        <ArrowLeftIcon size={18} className="group-hover:-translate-x-1 transition-transform" /> Back to Shop
      </Button>

      <div className="grid lg:grid-cols-2 gap-16 items-start">
        {/* Image Gallery */}
        <div className="space-y-6" data-aos="fade-right">
          <motion.div 
            layoutId={`product-${product.id}`}
            className="aspect-square bg-secondary/20 rounded-[3rem] overflow-hidden border border-black/5 flex items-center justify-center p-12 group"
          >
            <img 
              src={activeImage} 
              alt={product.product_name} 
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700"
            />
          </motion.div>
          
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {product.product_gallery.map((img: string, idx: number) => (
              <button 
                key={idx}
                onClick={() => setActiveImage(img)}
                className={`w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${activeImage === img ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-100'}`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="flex flex-col gap-8" data-aos="fade-left">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="bg-primary/10 text-primary border-none font-black uppercase tracking-widest text-[10px] px-3 py-1">
                {product.product_category}
              </Badge>
              {product.product_stock > 0 ? (
                <div className="flex items-center gap-1.5 text-neon-green text-[10px] font-black uppercase tracking-widest">
                  <div className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
                  In Stock
                </div>
              ) : (
                <div className="text-destructive text-[10px] font-black uppercase tracking-widest">Out of Stock</div>
              )}
            </div>

            <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">{product.product_name}</h1>
            
            <div className="flex items-center gap-4">
              <div className="flex text-neon-blue">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} size={18} weight={i < Math.floor(product.product_rating) ? "fill" : "regular"} />
                ))}
              </div>
              <span className="text-sm font-bold text-muted-foreground">{product.product_rating} ({product.product_reviews_count} Reviews)</span>
            </div>
          </div>

          <div className="flex items-baseline gap-4">
            {product.product_discounted_price ? (
              <>
                <span className="text-4xl font-black text-primary">${product.product_discounted_price}</span>
                <span className="text-xl text-muted-foreground line-through decoration-destructive/30">${product.product_price}</span>
                <Badge className="bg-destructive text-white border-none rounded-full px-2 py-0.5 text-[10px] font-black">-{product.product_discount_percentage}% OFF</Badge>
              </>
            ) : (
              <span className="text-4xl font-black text-primary">${product.product_price}</span>
            )}
          </div>

          <p className="text-muted-foreground text-lg leading-relaxed">
            {product.product_description}
          </p>

          <div className="flex items-center gap-6 pb-4 border-b border-black/5">
            <div className="flex items-center bg-secondary/30 rounded-full px-4 py-2 border border-black/5">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 flex items-center justify-center font-bold hover:text-primary transition-colors"
              >-</button>
              <span className="w-12 text-center font-black text-sm">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 flex items-center justify-center font-bold hover:text-primary transition-colors"
              >+</button>
            </div>
            <Button 
              onClick={handleAddToCart}
              className="flex-grow h-14 rounded-full font-black uppercase tracking-widest text-xs gap-3 shadow-xl shadow-primary/20"
            >
              <ShoppingCartIcon size={20} weight="bold" /> Add to Cart
            </Button>
          </div>

          {/* Features */}
          <div className="grid sm:grid-cols-2 gap-4">
            {product.product_features.map((feature: string, idx: number) => (
              <div key={idx} className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <CheckCircleIcon size={20} className="text-neon-blue shrink-0" weight="fill" />
                {feature}
              </div>
            ))}
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-4 pt-4">
            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-muted-foreground">
                <ShieldCheckIcon size={20} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-tighter opacity-60">2 Year Warranty</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-muted-foreground">
                <TruckIcon size={20} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-tighter opacity-60">Free Shipping</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-muted-foreground">
                <CubeIcon size={20} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-tighter opacity-60">30-Day Returns</span>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications Table */}
      <div className="mt-24" data-aos="fade-up">
        <h2 className="text-3xl font-black tracking-tighter mb-10 flex items-center gap-3">
          <ShieldIcon size={32} weight="fill" className="text-primary" />
          Technical Specifications.
        </h2>
        <div className="grid md:grid-cols-2 gap-x-12 gap-y-2 border-t border-black/5 pt-10">
          {product.product_specs.map((spec: any, idx: number) => (
            <div key={idx} className="flex justify-between py-4 border-b border-black/5 items-center">
              <span className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-60">{spec.label}</span>
              <span className="font-bold text-sm">{spec.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProductPage
