/** @jsx jsx */
import { NextPage } from "next";

import { jsx, css } from "@emotion/core";

import TopHero from "../src/components/organisms/TopHero";
import TopFooter from "../src/components/organisms/TopFooter";
import StartGuide from "../src/components/organisms/StartGuide";
import FeatureSection from "../src/components/organisms/FeatureSection";

const IndexPage: NextPage = () => {
  return (
    <div>
      <TopHero />
      <StartGuide />
      <FeatureSection />
      <TopFooter />
    </div>
  );
};

export default IndexPage;
