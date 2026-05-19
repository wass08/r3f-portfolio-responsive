/**
 * Centralized Data Export
 * All portfolio data in one place
 */

export { default as profile } from './profile';
export { default as skills } from './skills';
export { default as projects } from './projects';
export { default as socials } from './socials';
export { default as content } from './content';

// Export all data combined
import profile from './profile';
import skills from './skills';
import projects from './projects';
import socials from './socials';
import content from './content';

export const portfolioData = {
  profile,
  skills,
  projects,
  socials,
  content,
};

export default portfolioData;
