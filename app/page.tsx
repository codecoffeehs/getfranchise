import FranchiseCategoriesSection from "@/components/common/landing-page/CategoriesSection";
import CTASection from "@/components/common/landing-page/CTASection";
import HeroSection from "@/components/common/landing-page/HeroSection";
import HowItWorksSection from "@/components/common/landing-page/HowItWorksSection";
import Navbar from "@/components/common/landing-page/Navbar";
import WhyGetFranchiseSection from "@/components/common/landing-page/WhySection";

const Homepage=()=>{
  return(
      <>
      <Navbar/>
      <HeroSection/>
      <HowItWorksSection/>
      <WhyGetFranchiseSection/>
      <FranchiseCategoriesSection/>
      <CTASection/>
      </>
  )
}
export default Homepage;