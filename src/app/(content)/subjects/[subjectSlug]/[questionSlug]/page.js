import Content from "./Content";
import { getClient } from "@/lib/client";
import { gql } from "@apollo/client";

const getSubject = gql`
  query {
    subjects {
      data {
        attributes {
          Slug
          questions {
            data {
              attributes {
                Slug
              }
            }
          }
        }
      }
    }
  }
`;

export const dynamicParams = "blocking";

export async function generateStaticParams() {
  const client = getClient();
  const { data } = await client.query({ query: getSubject });
  const result = data.subjects.data.map((subject) => {
    return subject.attributes.questions.data.map((question) => {
      return {
        subjectSlug: subject.attributes.Slug,
        questionSlug: question.attributes.Slug,
      };
    });
  });
  return result.flat();
}

export default function Page({ params }) {
  return <Content params={params} />;
}
