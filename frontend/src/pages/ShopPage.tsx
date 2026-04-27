import { useState, useEffect } from "react"
import { ShoppingCart, Funnel, MagnifyingGlass, ArrowRight, Star } from "@phosphor-icons/react"
import SkeletonCard from "@/components/ui/SkeletonCard"

const products = [
  { id: 1, name: "RoboCore Pro v4", category: "Actuators", price: 899, rating: 4.9, img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=400" },
  { id: 2, name: "NeuralLink Hub", category: "Processors", price: 1299, rating: 5.0, img: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=400" },
  { id: 3, name: "VisionEye 4K", category: "Sensors", price: 450, rating: 4.8, img: "https://images.unsplash.com/photo-1626080358513-356ec397576c?q=80&w=400" },
  { id: 4, name: "LipoCell X1", category: "Battery", price: 299, rating: 4.7, img: "https://images.unsplash.com/photo-1563770660941-20978e870813?q=80&w=400" },
  { id: 5, name: "ServoGrip Mini", category: "Manipulation", price: 199, rating: 4.6, img: "https://images.unsplash.com/photo-1535378917042-10a22c95931a?q=80&w=400" },
  { id: 6, name: "AeroFrame S2", category: "Chassis", price: 2100, rating: 5.0, img: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=400" }
]

const ShopPage = () => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16" data-aos="fade-up">
        <div>
          <h1 className="text-5xl font-black tracking-tighter mb-4">THE STORE</h1>
          <p className="text-muted-foreground text-lg">Curated hardware for the ambitious builder.</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-grow md:w-80">
            <MagnifyingGlass size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search components..." 
              className="w-full bg-secondary/50 border rounded-full py-3 pl-12 pr-6 text-sm focus:ring-2 ring-accent outline-none transition-all"
            />
          </div>
          <button className="p-3 border rounded-full hover:bg-muted transition-colors">
            <Funnel size={20} weight="bold" />
          </button>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {isLoading ? (
          Array(8).fill(0).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          products.map((product) => (
            <div 
              key={product.id} 
              data-aos="fade-up"
              className="group relative bg-card border rounded-[2rem] p-5 hover:border-accent hover:shadow-2xl hover:shadow-accent/5 transition-all duration-500 overflow-hidden"
            >
              <div className="aspect-[4/5] bg-muted rounded-[1.5rem] overflow-hidden relative mb-6">
                <img 
                  src={product.img} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                />
                <div className={`absolute top-4 left-4 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20 text-white shadow-lg
                  ${product.category === 'Processors' ? 'bg-neon-purple/80' : 
                    product.category === 'Sensors' ? 'bg-neon-blue/80' : 
                    product.category === 'Battery' ? 'bg-neon-pink/80' : 'bg-black/60'}
                `}>
                  {product.category}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1 text-accent mb-2">
                  <Star size={14} weight="fill" />
                  <span className="text-xs font-bold">{product.rating}</span>
                </div>
                <h3 className="text-lg font-bold tracking-tight mb-2 group-hover:text-accent transition-colors">
                  {product.name}
                </h3>
                <div className="flex justify-between items-center mt-6">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Price</span>
                    <span className="text-xl font-black">${product.price}</span>
                  </div>
                  <button className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl shadow-black/10">
                    <ShoppingCart size={22} weight="bold" />
                  </button>
                </div>
              </div>

              {/* Quick Look Overlay */}
              <div className="absolute inset-x-0 bottom-0 p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-gradient-to-t from-background via-background/95 to-transparent">
                <button className="w-full bg-secondary text-secondary-foreground py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-accent hover:text-white transition-colors">
                  View Specifications <ArrowRight size={14} weight="bold" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default ShopPage
