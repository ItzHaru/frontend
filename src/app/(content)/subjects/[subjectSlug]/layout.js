import { getClient } from "@/lib/client";
import { gql } from "@apollo/client";
import Collapsible from "@/components/Collapsible.jsx";
import Link from "next/link";

const query = gql`
  query {
    subjects {
      data {
        attributes {
          Slug
        }
      }
    }
  }
`;

const getSubjectDetailsQuery = gql`
  query Query($slug: String!) {
    subjects(filters: { Slug: { eq: $slug } }) {
      data {
        attributes {
          Slug
          Name
          categories(sort: "id:asc") {
            data {
              attributes {
                Name
                Logo {
                  data {
                    attributes {
                      url
                    }
                  }
                }
                questions(pagination: { limit: 40 }) {
                  data {
                    attributes {
                      Name
                      Slug
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

// export async function generateStaticParams() {
//   const client = getClient();
//   const { data } = await client.query({
//     query: query,
//   });

//   return data.subjects.data.map((subject) => {
//     return {
//       subjectSlug: subject.attributes.Slug,
//     };
//   });
// }

// export const dynamicParams = false;

export default async function Layout({ children, params }) {
  const client = getClient();

  const { data: data2 } = await client.query({
    query: getSubjectDetailsQuery,
    variables: { slug: params.subjectSlug },
  });
  const subjects = data2.subjects.data.map((subject) => {
    return {
      slug: subject.attributes.Slug,
      categories: (subject.attributes.categories?.data || []).map(
        (category) => {
          return {
            name: category.attributes.Name,
            logo: category.attributes.Logo.data.attributes.url,
            questions: category.attributes.questions.data.map((question) => {
              return {
                name: question.attributes.Name,
                slug: question.attributes.Slug,
              };
            }),
          };
        }
      ),
    };
  });

  const categories = subjects[0].categories;
  let order = 0;
  return (
    <div className="bg-[#27293f] grid grid-cols-12 h-full">
      <aside className="col-span-3 flex flex-col gap-1 bg-[#1f2132] px-10 pb-5">
        {categories.map((category) => {
          return (
            <Collapsible
              key={category.name}
              title={category.name}
              url={category.logo}
            >
              <div className="border-l-4 mt-3 border-[#323349] px-4 flex flex-col gap-1">
                {category.questions.map((question) => {
                  order++;
                  return (
                    <Link
                      key={question.slug}
                      href={
                        "/subjects/" + params.subjectSlug + "/" + question.slug
                      }
                      className="hover:text-[#e2e8f0]"
                    >
                      {order}. {question.name}
                    </Link>
                  );
                })}
              </div>
            </Collapsible>
          );
        })}
      </aside>
      <div className="col-span-9">{children}</div>
    </div>
  );
}
