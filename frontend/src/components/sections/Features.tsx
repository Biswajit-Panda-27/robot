import { Cpu, ShieldCheck, Zap } from "lucide-react"

const Features = () => {
  return (
    <section className="py-20 bg-secondary/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: Cpu, title: "Neural Core", desc: "Advanced AI processing for real-time task handling." },
            { icon: ShieldCheck, title: "Secure Link", desc: "Military-grade encryption for all remote connections." },
            { icon: Zap, title: "Hyper Speed", desc: "Ultra-low latency control with 5G connectivity." }
          ].map((f, i) => (
            <div 
              key={i} 
              data-aos="fade-up" 
              data-aos-delay={i * 100}
              className="glass p-8 rounded-3xl hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center mb-6">
                <f.icon size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">{f.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
