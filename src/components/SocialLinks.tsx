export const SocialLinks = ({ website, twitter, github, linkedin }: { website?: string; twitter?: string; github?: string; linkedin?: string }) => (
  <div className="flex gap-3">
    {website && <a href={website} className="text-blue-600 hover:text-blue-700" target="_blank" rel="noopener noreferrer">🌐</a>}
    {twitter && <a href={`https://twitter.com/${twitter}`} className="text-blue-600 hover:text-blue-700" target="_blank" rel="noopener noreferrer">🐦</a>}
    {github && <a href={`https://github.com/${github}`} className="text-blue-600 hover:text-blue-700" target="_blank" rel="noopener noreferrer">💻</a>}
    {linkedin && <a href={`https://linkedin.com/in/${linkedin}`} className="text-blue-600 hover:text-blue-700" target="_blank" rel="noopener noreferrer">💼</a>}
  </div>
);

