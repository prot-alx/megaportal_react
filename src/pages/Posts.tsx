import { FC } from "react";
import { useGetPostsQuery } from "../app/services/api";

const Posts: FC = () => {
  const { data: posts, error, isLoading } = useGetPostsQuery();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error occurred</div>;

  return (
    <ul>
      {posts?.map((post) => (
        <li key={post.id}>
          <h3 className="text-xl">{post.title}</h3>
          <p>{post.body}</p>
        </li>
      ))}
    </ul>
  );
};

export { Posts };
