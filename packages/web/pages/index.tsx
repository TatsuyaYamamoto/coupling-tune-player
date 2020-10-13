/** @jsx jsx */
import { NextPage } from "next";

import { jsx, css } from "@emotion/core";

import TopHero from "../src/containers/organisms/TopHero";
import TopFooter from "../src/containers/organisms/TopFooter";
import StartGuide from "../src/containers/organisms/StartGuide";
import FeatureSection from "../src/containers/organisms/FeatureSection";

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
