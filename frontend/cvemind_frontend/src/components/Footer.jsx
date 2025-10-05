import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { Github, Twitter, Mail, Heart, Shield } from "lucide-react";

const FooterContainer = styled.footer`
  background: ${({ theme }) => theme.colors.surface};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  margin-top: auto;
  position: relative;
  z-index: 10;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 2rem 2rem;
  
  @media (max-width: 768px) {
    padding: 2rem 1rem 1rem;
  }
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 2rem;
  margin-bottom: 2rem;
  align-items: start;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    text-align: center;
  }
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FooterTitle = styled.h3`
  color: ${({ theme }) => theme.colors.text};
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FooterDescription = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
  margin: 0;
  font-size: 0.875rem;
`;

const FooterLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const FooterLink = styled.a`
  color: ${({ theme }) => theme.colors.textSecondary};
  text-decoration: none;
  font-size: 0.875rem;
  transition: color ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
`;

const SocialLink = styled(motion.a)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  background: ${({ theme }) => theme.colors.surfaceSecondary};
  color: ${({ theme }) => theme.colors.textMuted};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  text-decoration: none;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background: ${({ theme }) => theme.colors.accent};
    color: white;
  }
`;

const FooterBottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 2rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  flex-wrap: wrap;
  gap: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
  }
`;

const Copyright = styled.div`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const LegalLinks = styled.div`
  display: flex;
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.75rem;
  }
`;

const LegalLink = styled.a`
  color: ${({ theme }) => theme.colors.textMuted};
  text-decoration: none;
  font-size: 0.875rem;
  transition: color ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

const DeveloperCredit = styled.div`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  
  a {
    color: ${({ theme }) => theme.colors.accent};
    text-decoration: none;
    font-weight: 500;
    transition: color ${({ theme }) => theme.transitions.fast};
    
    &:hover {
      color: ${({ theme }) => theme.colors.accentHover};
    }
  }
`;

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <FooterContainer>
      <FooterContent>
        <FooterGrid>
          <FooterSection>
            <FooterTitle>
              <Shield size={20} />
              CVEMind
            </FooterTitle>
            <FooterDescription>
              Empowering cybersecurity professionals with AI-driven vulnerability 
              intelligence and comprehensive threat analysis.
            </FooterDescription>
            <SocialLinks>
              <SocialLink
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Github size={18} />
              </SocialLink>
              <SocialLink
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Twitter size={18} />
              </SocialLink>
              <SocialLink
                href="mailto:info@cvemind.com"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Mail size={18} />
              </SocialLink>
            </SocialLinks>
          </FooterSection>

          <FooterSection>
            <FooterTitle>Quick Links</FooterTitle>
            <FooterLinks>
              <FooterLink href="/all">Browse CVEs</FooterLink>
              <FooterLink href="/results">Search</FooterLink>
              <FooterLink href="/">Documentation</FooterLink>
              <FooterLink href="/">API</FooterLink>
            </FooterLinks>
          </FooterSection>

          <FooterSection>
            <FooterTitle>Support</FooterTitle>
            <FooterLinks>
              <FooterLink href="/">Help Center</FooterLink>
              <FooterLink href="/">Contact</FooterLink>
              <FooterLink href="/">Report Bug</FooterLink>
            </FooterLinks>
          </FooterSection>
        </FooterGrid>

        <FooterBottom>
          <Copyright>
            &copy; {currentYear} CVEMind. All rights reserved.
          </Copyright>
          
          <DeveloperCredit>
            Developed by{' '}
            <a 
              href="https://github.com/krishporwal14" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Krish Porwal
            </a>
          </DeveloperCredit>
        </FooterBottom>
      </FooterContent>
    </FooterContainer>
  );
}
