import React from 'react';
import { Globe, Users, Podcast, Newspaper, Heart, AlertTriangle } from 'lucide-react';

export const WinTheNightInfo: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-theme-gradient">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-theme-accent mb-1">Organization Overview</h3>
            <p className="text-gray-300">
              Win The Night is a mental health organization focusing on introspective healing and addressing generational trauma. 
              They foster healing through podcast conversations, an online community, and website insights.
            </p>
            <a 
              href="https://winthenight.org" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-theme-accent hover:text-theme-secondary text-sm mt-2 inline-block"
            >
              Visit Website →
            </a>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-theme-gradient">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-theme-accent mb-1">Founders</h3>
            <p className="text-gray-300">
              Josh Lopez and Jake Freudinger, high school friends turned storytellers and filmmakers, 
              lead the initiative. Jake manages social media, Substack, and YouTube content, while Josh 
              hosts the podcast and provides creative direction.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-theme-gradient">
            <Podcast className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-theme-accent mb-1">Podcast</h3>
            <p className="text-gray-300">
              Their podcast features deep conversations about personal stories and mental health topics, 
              with episodes highlighting discussions on trauma, healing, and personal growth.
            </p>
            <a 
              href="https://winthenight.org/podcast" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-theme-accent hover:text-theme-secondary text-sm mt-2 inline-block"
            >
              Listen to Podcast →
            </a>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-theme-gradient">
            <Newspaper className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-theme-accent mb-1">Blog and Substack</h3>
            <p className="text-gray-300">
              Win The Night maintains an active Substack presence, sharing articles and insights on 
              mental health, including workplace mental health discussions and personal trauma reflections.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-theme-gradient">
            <Heart className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-theme-accent mb-1">Community Engagement</h3>
            <p className="text-gray-300">
              The community is built around people working together to "Win The Night." Members can subscribe 
              to their newsletter for direct insights and advice. Premium subscribers receive exclusive content 
              and podcast episode shoutouts.
            </p>
            <div className="mt-2 space-y-2">
              <a 
                href="https://youtube.com/@winthenight?sub_confirmation=1" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-theme-accent hover:text-theme-secondary text-sm block"
              >
                Subscribe on YouTube →
              </a>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-red-900/50">
            <AlertTriangle className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-red-400 mb-1">Crisis Resources</h3>
            <p className="text-gray-300">
              If you're in crisis or need immediate support, please visit our crisis resources page.
            </p>
            <a 
              href="https://winthenight.org/p/crisis-resources" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-red-400 hover:text-red-300 text-sm mt-2 inline-block"
            >
              Access Crisis Resources →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
