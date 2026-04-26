export interface Project {
  title: string;
  description: string;
  tools: string[];
  images: string[];
  techStack: string[];
}

export interface WorkExperience {
  company: string;
  role: string;
  description: string;
  images: string[];
}

export interface NavItem {
  label: string;
  href: string;
}
