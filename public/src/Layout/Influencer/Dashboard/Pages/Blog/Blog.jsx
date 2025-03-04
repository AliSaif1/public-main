import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const monthsBack = 6;

        const response = await axios.get(`/influencer/blogs?monthsBack=${monthsBack}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
        });

        const result = response.data;

        const blogs = result.map(item => item.blogs);
        setPosts(blogs);
      } catch (err) {
        setError('Error fetching blogs');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  useEffect(() => {
    console.log('Posts updated:', posts); 
  }, [posts]);

  return (
    <>
      <div className="sm:w-[500px] mdm:w-[600px] lg:w-[900px] mx-auto pt-5 h-screen">
        <div
          className="flex justify-end cursor-pointer mb-5"
          onClick={() => navigate('CreateBlog')}
        >
          <img src="/Svg/Write.svg" alt="Write" />
        </div>
        <div className="space-y-5">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            posts.length === 0 ? (
              <p>No blogs available.</p>
            ) : (
              posts.map((post) => (
                <BlogPost
                  key={post._id}
                  Title={post.title}
                  Body={post.body}
                  Time={new Date(post.postedAt).toLocaleTimeString()}
                  Image={post.blogMainImg}
                />
              ))
            )
          )}
        </div>
      </div>
    </>
  );
};

const BlogPost = ({ Title, Body, Time, Image }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const truncatedBody = Body.length > 250 ? Body.substring(0, 250) + '...' : Body;

  return (
    <div className="bg-white mx-auto sm:w-[500px] mdm:w-[600px] lg:w-[700px] rounded-xl p-2 text-[9px] xs:text-[10px] sm:text-[13px] md:text-[11px]">
      <div className="p-2 grid grid-cols-12">
        <div className="col-span-9">
          <p className="text-[12px] mdm:text-lg lato-bold">{Title}</p>
          <p className="poppins-regular mt-1">
            {isExpanded ? Body : truncatedBody}
            {Body.length > 250 && (
              <span
                onClick={() => setIsExpanded(!isExpanded)}
                className="ml-2 text-orange-500 cursor-pointer"
              >
                {isExpanded ? 'Read less' : 'Read more'}
              </span>
            )}</p>
          <div className="flex justify-between mt-2">
            <p className="text-black/50">{Time}</p>
            <div>
              <img src="/Svg/More.svg" alt="More" />
            </div>
          </div>
        </div>
        <div className="col-span-3 flex justify-center items-center">
          <div className="flex size-[60px] xs:size-[80px] sm:size-[100px] md:size-[100px] items-center rounded-lg overflow-hidden">
            <img className="aspect-square Avatar-v1" src={Image} alt="Blog Post" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;