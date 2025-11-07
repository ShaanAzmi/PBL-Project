import About from "@/components/About";
import DiseaseStatistics from "@/components/DiseaseStatistics";
import AllIndiaDiseaseData from "@/components/AllIndiaDiseaseData";
import Intro from "@/components/Intro";
import Testimonials from "@/components/Testimonials";

export default function Home() {
  return(
    <div className="space-y-20">
      <Intro/>
      <About/>
      <DiseaseStatistics/>
      <AllIndiaDiseaseData/>
      <Testimonials/>
    </div>
  )
}
