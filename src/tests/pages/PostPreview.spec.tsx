import { render, screen } from "@testing-library/react";
import { mocked } from "jest-mock";
import { getSession } from "next-auth/react";
import Post, { getStaticProps } from "../../pages/posts/preview/[slug]";
import { getPrismicClient } from "../../services/prismic";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const post = {
  slug: "my-new-post",
  title: "My new post",
  content: "<p>Post excerpt</p>",
  updatedAt: "10 de Abril",
};

jest.mock("next-auth/react");
jest.mock("next/router");
jest.mock("../../services/prismic");

describe("Post preview page", () => {
  it("renders correctly", () => {
    const useSessionMocked = mocked(useSession);

    useSessionMocked.mockReturnValueOnce({
      data: null,
      status: "unauthenticated",
    });

    render(<Post post={post} />);

    expect(screen.getByText("My new post")).toBeInTheDocument();
    expect(screen.getByText("Post excerpt")).toBeInTheDocument();
    expect(screen.getByText("Wanna continue reading?")).toBeInTheDocument();
  });

  it("redirects user to full post when user is subscribed", async () => {
    const useSessionMocked = mocked(useSession);
    const useRouterMocked = mocked(useRouter);
    const pushMock = jest.fn();

    useSessionMocked.mockReturnValueOnce({
      data: { activeSubscription: "fake-active-subscription" },
      status: "unauthenticated",
    } as any);

    useRouterMocked.mockReturnValueOnce({
      push: pushMock,
    } as any);

    render(<Post post={post} />);

    expect(pushMock).toHaveBeenCalledWith("/posts/my-new-post");
  });

  //   it("loads initial data", async () => {
  //     const getsessionMocked = mocked(getSession);

  //     const getPrismicClientMocked = mocked(getPrismicClient);

  //     getPrismicClientMocked.mockReturnValueOnce({
  //       getByUID: jest.fn().mockResolvedValueOnce({
  //         data: {
  //           title: [{ type: "heading", text: "My new post" }],
  //           content: [{ type: "paragraph", text: "Post content" }],
  //         },
  //         last_publication_date: "04-01-2021",
  //       }),
  //     } as any);

  //     getsessionMocked.mockResolvedValueOnce({
  //       activeSubscription: "fake-active-subscription",
  //     } as any);

  //     const response = await getServerSideProps({
  //       params: { slug: "my-new-post" },
  //     } as any);

  //     expect(response).toEqual(
  //       expect.objectContaining({
  //         props: {
  //           post: {
  //             slug: "my-new-post",
  //             title: "My new post",
  //             content: "<p>Post content</p>",
  //             updatedAt: "01 de abril de 2021",
  //           },
  //         },
  //       })
  //     );
  //   });
});
