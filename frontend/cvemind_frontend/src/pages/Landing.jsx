import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";
import { Shield, Zap, Brain, ArrowRight } from "lucide-react";
import BrainBackground from "../components/BrainBackground";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SearchBar from "../components/SearchBar";

const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const HeroSection = styled.section`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  position: relative;
  z-index: 1;
  min-height: 80vh;
  
  @media (max-width: 768px) {
    padding: 2rem 1rem;
    min-height: 70vh;
  }
`;

const HeroContent = styled(motion.div)`
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled(motion.h1)`
  font-size: clamp(2.5rem, 8vw, 4rem);
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 1.5rem;
  line-height: 1.1;
  
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.text} 0%,
    ${({ theme }) => theme.colors.accent} 50%,
    ${({ theme }) => theme.colors.text} 100%
  );
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-size: 200% 100%;
  animation: shimmer 3s ease-in-out infinite;
  
  @keyframes shimmer {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
`;

const Subtitle = styled(motion.p)`
  font-size: clamp(1rem, 3vw, 1.25rem);
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 3rem;
  line-height: 1.6;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const SearchSection = styled(motion.div)`
  width: 100%;
  margin-bottom: 3rem;
`;

const FeaturesSection = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 4rem;
  max-width: 900px;
  width: 100%;
`;

const FeatureCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: 2rem;
  text-align: center;
  transition: all ${({ theme }) => theme.transitions.normal};
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
    box-shadow: ${({ theme }) => theme.shadows.lg};
    transform: translateY(-4px);
  }
`;

const FeatureIcon = styled.div`
  width: 3rem;
  height: 3rem;
  background: ${({ theme }) => theme.colors.accent};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  color: white;
`;

const FeatureTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 0.75rem;
`;

const FeatureDescription = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
  margin: 0;
`;

const CTASection = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-top: 3rem;
`;

const CTAButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: ${({ theme }) => theme.colors.accent};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.normal};
  
  &:hover {
    background: ${({ theme }) => theme.colors.accentHover};
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
`;

const StatsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 2rem;
  margin: 4rem 0 2rem;
  padding: 2rem;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  backdrop-filter: blur(10px);
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.accent};
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export default function Landing() {
  const navigate = useNavigate();
  
  const handleSearch = (keyword) => {
    if (keyword.trim()) {
      navigate(`/results?keyword=${encodeURIComponent(keyword)}`);
    }
  };

  const features = [
    {
      icon: Shield,
      title: "Comprehensive CVE Database",
      description: "Access to thousands of vulnerability records with real-time updates from the National Vulnerability Database.",
    },
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Get intelligent insights and summaries of vulnerabilities using advanced AI technology.",
    },
    {
      icon: Zap,
      title: "Lightning Fast Search",
      description: "Find specific vulnerabilities instantly with our powerful search engine and smart filtering.",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <PageContainer>
      <BrainBackground />
      <Navbar />
      
      <HeroSection>
        <HeroContent
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Title
            variants={itemVariants}
          >
            CVEMind
          </Title>
          
          <Subtitle
            variants={itemVariants}
          >
            Discover, analyze, and understand cybersecurity vulnerabilities with 
            AI-powered insights and comprehensive threat intelligence.
          </Subtitle>
          
          <SearchSection
            variants={itemVariants}
          >
            <SearchBar 
              onSearch={handleSearch}
              autoFocus={true}
              placeholder="Search CVEs, vendors, or keywords (e.g., Apache, CVE-2024-1234)"
            />
          </SearchSection>

          <StatsGrid
            variants={itemVariants}
          >
            <StatItem>
              <StatNumber>250K+</StatNumber>
              <StatLabel>CVE Records</StatLabel>
            </StatItem>
            <StatItem>
              <StatNumber>24/7</StatNumber>
              <StatLabel>Real-time Updates</StatLabel>
            </StatItem>
            <StatItem>
              <StatNumber>AI</StatNumber>
              <StatLabel>Powered Analysis</StatLabel>
            </StatItem>
            <StatItem>
              <StatNumber>99.9%</StatNumber>
              <StatLabel>Uptime</StatLabel>
            </StatItem>
          </StatsGrid>
          
          <FeaturesSection
            variants={containerVariants}
          >
            {features.map((feature) => (
              <FeatureCard
                key={feature.title}
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
              >
                <FeatureIcon>
                  <feature.icon size={24} />
                </FeatureIcon>
                <FeatureTitle>{feature.title}</FeatureTitle>
                <FeatureDescription>{feature.description}</FeatureDescription>
              </FeatureCard>
            ))}
          </FeaturesSection>
          
          <CTASection
            variants={itemVariants}
          >
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <CTAButton
                onClick={() => navigate('/all')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Browse All CVEs
                <ArrowRight size={20} />
              </CTAButton>
              
              <CTAButton
                onClick={() => navigate('/results')}
                style={{ 
                  background: 'transparent', 
                  border: '1px solid var(--accent)', 
                  color: 'var(--accent)' 
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Search CVEs
                <ArrowRight size={20} />
              </CTAButton>
            </div>
          </CTASection>
        </HeroContent>
      </HeroSection>
      
      <Footer />
    </PageContainer>
  );
}
