import { useEffect, useState } from 'react';
import api from '../api/axios';

const fallbackPosts = [
  {
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=500',
    caption: 'Embracing the minimalist silhouette this season. Find our premium cashmere coat line in store now. #MinimalStyle #WinterWarmth',
    postedDate: 'May 28, 2026',
  },
  {
    imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=500',
    caption: 'Unveiling our summer resort line. Earthy tones paired with lightweight, luxury organic linens. #ResortStyle #LinenLove',
    postedDate: 'May 25, 2026',
  },
  {
    imageUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=500',
    caption: 'Crafted to perfection. A gentleman\'s footwear collection, custom handcrafted in Italy. #ItalianLeather #DapperStyle',
    postedDate: 'May 20, 2026',
  },
];

const createShareUrl = (platform, caption) => {
  const text = encodeURIComponent(`${caption} - Discover Vogue Plaza.`);
  const url = encodeURIComponent(window.location.href);
  switch (platform) {
    case 'FB':
      return `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    case 'TW':
      return `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
    case 'WA':
      return `https://api.whatsapp.com/send?text=${text}%20${url}`;
    case 'LN':
      return `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
    default:
      return '#';
  }
};

export default function StyleFeed() {
  const [posts, setPosts] = useState(fallbackPosts);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get(`/posts?page=${page}&limit=3`);
        if (response.data && Array.isArray(response.data.posts) && response.data.posts.length > 0) {
          setPosts((prev) => (page === 1 ? response.data.posts : [...prev, ...response.data.posts]));
          setHasMore(response.data.posts.length >= 3);
        }
      } catch (error) {
        if (page === 1) {
          setPosts(fallbackPosts);
        }
      }
    };

    fetchPosts();
  }, [page]);

  const loadMore = () => {
    setPage((prev) => prev + 1);
  };

  return (
    <section id="timeline" className="section-alt">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">STYLE FEED</h2>
        </div>
        <div className="social-grid">
          {posts.map((post, index) => (
            <div key={`${post.postedDate}-${index}`} className="social-card">
              <div className="social-img-container">
                <img src={post.imageUrl} alt={post.caption} className="social-img" loading="lazy" />
              </div>
              <div className="social-content">
                <p className="social-caption">{post.caption}</p>
                <div className="social-meta">
                  <span className="social-date">{post.postedDate}</span>
                  <div className="social-shares">
                    {['FB', 'TW', 'WA', 'LN'].map((platform) => (
                      <button
                        key={platform}
                        type="button"
                        className="share-btn"
                        title={platform}
                        onClick={() => window.open(createShareUrl(platform, post.caption), '_blank')}
                      >
                        {platform}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="load-more-container">
          <button type="button" className="btn-outline" onClick={loadMore} disabled={!hasMore}>
            Load More Style Feed
          </button>
        </div>
      </div>
    </section>
  );
}
