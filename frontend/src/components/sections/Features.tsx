import { HeartIcon, GraduationCapIcon, ShieldCheckIcon } from "@phosphor-icons/react"

const Features = () => {
  return (
    <section className="py-20 bg-secondary/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: HeartIcon, title: "Joy Guaranteed", desc: "Every toy is hand-picked to bring endless smiles and laughter to your little ones.", color: "text-neon-pink" },
            { icon: GraduationCapIcon, title: "STEM Ready", desc: "Boost cognitive skills with toys designed for learning, logic, and creative problem solving.", color: "text-neon-blue" },
            { icon: ShieldCheckIcon, title: "100% Safe", desc: "Non-toxic, eco-friendly materials that meet the highest safety standards for worry-free play.", color: "text-neon-green" }
          ].map((f, i) => (
            <div 
              key={i} 
              data-aos="fade-up" 
              data-aos-delay={i * 100}
              className="bg-card p-8 rounded-[2.5rem] hover:-translate-y-2 transition-transform duration-300 shadow-sm border border-transparent hover:border-primary/10"
            >
              <div className={`w-14 h-14 bg-secondary rounded-2xl flex items-center justify-center mb-6 ${f.color}`}>
                <f.icon size={28} weight="fill" />
              </div>
              <h3 className="text-xl font-bold mb-3">{f.title}</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
