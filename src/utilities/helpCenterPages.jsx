import React, { Fragment } from "react";
import {
  formatStringContainingMeasurement,
  camelToHumanCase,
} from "./stringUtilities";
import {
  contactEmail,
  version,
  siteName,
  encodedNewLine,
} from "./utilityConstants";
import {
  toolDescription1,
  faq1,
  howTo1,
  howTo2,
  howTo3,
  howTo4,
  howTo5,
  howTo6,
  howTo7,
  howTo8,
} from "../images/help-center";
import {
  unrestrictedFeatureDefinitions,
  financialFeatureDefinitions,
} from "./featureDefinitions";
import { versionReleaseNotes } from "./releaseNotes";

const helpCenterImg = (src, maxWidth = 1000) => (
  <div className="flex-column justify-center">
    <img
      src={src}
      alt=""
      style={{
        alignSelf: "left",
        maxWidth: `${maxWidth}px`,
        margin: "1rem 0 2rem",
      }}
    />
  </div>
);

const ourVision = {
  heading: `Our Vision at ${siteName}`,
  body: (
    <p>
      {siteName} is an internally developed data analytics tool that provides
      decision support to engineers and supplier management. The purpose is to
      reduce design time and contracting price of compounds, leading to
      increasing cost consciousness and understanding the impact of design
      decisions. Unlike other commercial off-the-shelf products, {siteName} uses
      unbiased and objective geometric features. Using data clustering and
      categorization, this tool provides new cross-functional evaluation
      capabilities to visualize physical and price patterns for chemical
      compounds across chemdw Commercial Chemical Companies.
    </p>
  ),
};

const featureDefinitionMap = {
  ...unrestrictedFeatureDefinitions,
  ...financialFeatureDefinitions,
};

const featureDefinition = {
  heading: "Feature Definition",
  body: (
    <Fragment>
      {Object.keys(featureDefinitionMap).map((feature) => {
        const formattedFeature =
          feature.indexOf(" ") > -1
            ? feature
            : formatStringContainingMeasurement(camelToHumanCase(feature));
        return (
          <p key={`feature-definition-${feature}`}>
            <b>{formattedFeature}</b> - {featureDefinitionMap[feature]}
          </p>
        );
      })}
    </Fragment>
  ),
};

const contactUs = {
  heading: "Contact Us",
  body: (
    <Fragment>
      <a href={`mailto:${contactEmail}:`}>{contactEmail}</a>
    </Fragment>
  ),
};

const faq = (totalCompoundCount) => {
  return {
    heading: "FAQ",
    body: (
      <Fragment>
        <ol>
          <li>
            What is the {siteName} Tool?
            <p>
              {siteName} is a tool that seeks to increase productivity of
              chemists by allowing them to quickly identify many similar
              compounds to one they may be working to design or analyze.
            </p>
          </li>
          <li>
            Who are the creators of {siteName}?
            <p>
              {siteName} is managed under{" "}
              <a href="http://www.chemdw.com/">Chemical DW</a> under Analytics.
            </p>
          </li>
          <li>
            How do I optimize my experience?
            <p>
              For best experience, we recommend viewing {siteName} on Mozilla
              Firefox.
            </p>
          </li>
          <li>
            What is the source of {siteName}’s data?
            <p>{siteName} gets data from many public sources.</p>
          </li>
          <li>
            What are {siteName}’s key strength’s?
            <p>Visuals- quickly view images of compounds and see their data</p>
            <p>
              Compound shape data- {siteName} uses an innovative shape
              classification system to decode a part’s 3D spatial features
            </p>
            <p>
              Compound similarity- Compare compounds with others that share
              similar features.
            </p>
            <p>
              Supplier compound trends- See types of compounds specific
              suppliers manufacture
            </p>
            <p>
              Pricing trends- Observe how compounds are priced to learn shape,
              supplier, material and processing trends
            </p>
          </li>
          <li>
            What are the types of data {siteName} uses?
            <p>
              {totalCompoundCount} compounds in the {siteName} library, which
              contains the following types of compounds:
            </p>
            <ul>
              <li>
                <p>Materials:</p>
                <ul>
                  <li>Aluminum</li>
                  <li>Titanium</li>
                </ul>
              </li>
              <li>
                <p>Process Forms:</p>
                <ul>
                  <li>Extrusion</li>
                  <li>Plate</li>
                  <li>Sheet</li>
                </ul>
              </li>
              <li>
                <p>Programs:</p>
                <ul>
                  <li>pubchem</li>
                </ul>
              </li>
            </ul>
            <p>
              * including unreleased compounds with appropriate permissions. We
              are currently working to expand our library to include steel,
              forged and composite compounds.
            </p>
          </li>
          <li>
            What are the requirements to access {siteName}?
            <p>{siteName} Users.</p>
          </li>

          <li>
            How can I contact the creators?
            <p>
              {`Users can contact ${siteName} by emailing us at ${contactEmail}`}
            </p>
          </li>
          <li>
            Where are instruction manuals located?
            <p>
              See <a href="/help?title=how-to">How-To For Beginners</a> section
            </p>
          </li>
          <li>
            Where can I request compounds to be put into the application?
            <p>
              {`Within the user dropdown (see below) select "Submit Compound." 
                            Upon completion of the compound request dialogue, ${siteName} 
                            Administrators will be alerted to the request in order to 
                            evaulate and take action.`}
            </p>
            {helpCenterImg(faq1)}
          </li>
          <li>
            What software is the application built in?{" "}
            <p>
              {siteName} is a web application hosted in Pivotal Cloud Foundry
              that uses Python, Node.js, and React.js. It also utilizes Docker
              for development and BDD-cucumber for testing.
            </p>
          </li>
          <li>
            Why do some compounds not have images?
            <p>
              We are actively working on building our image repository. Some
              compounds do not have images generated yet. We are working
              actively to fix this issue. Our image repository will be moving
              soon, so there may temporary loss of compound image functionality
              during the transition.
            </p>
          </li>
        </ol>
      </Fragment>
    ),
  };
};

const toolDescription = {
  heading: "Tool Description",
  body: (
    <Fragment>
      <p>
        <b>
          {siteName} web app is primarily utilizes two data extraction tools as
          sources.
        </b>
      </p>
      <ol>
        <li>
          <p>
            {siteName} specifically uses pubchem for its ability to provide
            physical and dimensional compound data.
          </p>
        </li>
        <li>
          <p>
            It utilizes voxelization, the 3D version of pixelization, to
            determine the shape of the volume of the part. Using this data, a
            machine learned neural network encodes a numerical feature vector of
            8172. This feature vector is then used to compare compounds to each
            other by way of shape similarity.
          </p>
        </li>
      </ol>
      {helpCenterImg(toolDescription1)}
    </Fragment>
  ),
};

const releaseNotes = {
  heading: `Release Notes (${version})`,
  body: (
    <div>
      {versionReleaseNotes.map((releaseNote, i) => (
        <div key={`release-notes-${releaseNote.version}`}>
          {i !== 0 && <h3>Release Notes ({releaseNote.version})</h3>}
          <ul>
            {releaseNote.notes.map((note, i) => (
              <li key={`${releaseNote.version}-${i}`}>{note}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  ),
};

const siteMetrics = (totalCompoundCount) => {
  return {
    heading: `${siteName} Metrics`,
    body: (
      <Fragment>
        <p>Total Compound Count: {totalCompoundCount}</p>
        <p>More Metrics Coming Soon</p>
      </Fragment>
    ),
  };
};

const introductionHowTo = {
  heading: "Introduction/ How To",
  body: (
    <Fragment>
      <p>
        <i>Searching</i>
      </p>
      <ol>
        <li>
          <p>
            The application home screen defaults to the "Seach Compounds" tab.
            Users are able to input a single compound number or multiple
            compound numbers separated by a space or comma into the search
            field. The example below contains copied and pasted compound numbers
            from an Excel spreadsheet.
          </p>

          {helpCenterImg(howTo1)}
        </li>
        <li>
          <p>
            Proceed by pressing the “Enter” key or clicking “View All Results.”
            The resulting search will navigate the user to the All Compounds
            View, where results have been filtered down to the searched
            compounds (if available).
          </p>
          {helpCenterImg(howTo2)}
        </li>
        <li>
          <p>
            By clicking on a particular compoundsColumnsConfigStore, users are
            able to enter the Detailed Compound View. In-depth compound
            information is provided, as well as further images as available. The
            "Compare Compound to Library" button offers visualizations to
            understand how the selected compound compares to the entire compound
            library. The "Explore Similar Compounds" button navigates the user
            to the Similar Compound View.
          </p>

          {helpCenterImg(howTo3)}
        </li>
        <li>
          <p>
            The Similar Compounds View contains summarized information of the
            "Queried Compound" (the compound that the similar results are
            derived from), as well as an interface to view the the similar
            results.
          </p>
          {helpCenterImg(howTo4)}
        </li>
        <li>
          <p>
            The Similar Compounds table and grid view offer the full sorting and
            filtering capabilities as seen on the All Compounds View.
          </p>
          {helpCenterImg(howTo5)}
        </li>
        <li>
          <p>
            Users may toggle the "Table View" versus the "Grid View" by
            utilizing the available button.
          </p>
          {helpCenterImg(howTo6)}
        </li>
        <li>
          <p>
            Additional options include toggling the Multi Select View,
            visualizations within the "Explore Features" and "Compare Compound
            to Results" buttons, exporting results to a CSV, and controlling the
            Quantity of Similar Results.
          </p>
          {helpCenterImg(howTo7, 400)}
        </li>
        <li>
          <p>
            Another way to investigate compounds is the "Explore Compounds" tab
            back at the application landing page. Users may filter down
            compounds to a subset of the entire library.
          </p>
          {helpCenterImg(howTo8)}
        </li>
        <li>
          <p>
            The Icicle Chart creates subsets of the compound library by applying
            all filters of the containing rectangles to the left in addition to
            the title of a particular rectangle. An example above might be the
            label of "Plate Compounds." The 64,300 compounds within this subset
            are constrained to Aluminum and Plate compounds only. Clicking a
            rectangle on the right zooms into a subset, while clicking the
            rectangle on the left zooms out a level. Clicking the title will
            navigate to the All Compounds View with the subset of filters
            applied.
          </p>
        </li>
      </ol>
    </Fragment>
  ),
};

const exportControl = {
  heading: "Export Control",
  body: (
    <Fragment>
      <ul>
        <li>
          <p>
            Data in this application is EXPORT CONTROLLED - This technology or
            software is subject to the U.S. Export Administration Regulations
            (EAR), (15 C.F.R. Compounds 730-774).
          </p>
        </li>
        <li>
          <p>
            Only items for which no authorization from the U.S. Department of
            Commerce is required for export, re-export, in-country transfer, or
            access EXCEPT to country group E: 1 or E: 2 countries/persons per
            Supp.1 to Compound 740 of the EAR may be stored in this application.
          </p>
        </li>
        <li>
          <p>
            These export control classification numbers (ECCN) are examples for
            files which can be stored in this application: 9E991, 7E994, 1E994,
            EAR99.
          </p>
        </li>
        <li>
          <p>
            Do not input EXPORT CONTROLLED technical data that requires
            authorization from the U.S. Department of Commerce or is controlled
            by United States International Traffic in Arms Regulations (ITAR)
            (22 CFR 120-130).
          </p>
        </li>
        <li>
          <p>
            It is the personal responsibility of each individual in control of
            this data to abide by all export laws.
          </p>
        </li>
      </ul>
    </Fragment>
  ),
};

const privacyNotice = {
  heading: "Privacy Notice",
  body: <Fragment>privacy notice can be found </Fragment>,
};

const financialAccessRequirements = (userInfo = false) => {
  console.log(userInfo);
  const emailBody = userInfo
    ? `Dear Administrator,
        ${encodedNewLine}${encodedNewLine}I am requesting finance access for ID: ${userInfo.user_id}
        ${encodedNewLine}${encodedNewLine}Thank You,
        ${encodedNewLine}${userInfo.name}
        ${encodedNewLine}${userInfo.email}`
    : "";
  return {
    heading: "Financial Access",
    body: (
      <Fragment>
        <p>
          The following requirements must be met to receive access to financial
          data for compounds. If you have met these requirements contact
          CompoundMatch administrators
        </p>
        <br />
        <b>Requirements</b>
        <ul>
          <li>US Person</li>
          <li>Internal chemdw person</li>
        </ul>
        <b>Training</b>
        <ul>
          <li>TR012202 - Proprietary Supplier Pricing Data</li>
          <li>
            TR021002 - chemdw Employee Contact with Providers of Goods or
            Services
          </li>
          <li>82057 - Information Security 2019</li>
          <li>80537 - Global Trade Awareness</li>
        </ul>
        <b>Services</b>
        <ul>
          <li>Read PRO-2227 (Information Protection)</li>
        </ul>
        <br />
        <i>
          Non-BCA users will require a Deviation provided by their organization
        </i>
        <br />
        <br />
        <h3>
          Please contact{" "}
          <a
            href={`mailto:${contactEmail}?subject=Requesting ${siteName} Financial Data Access&body=${emailBody}`}
          >
            {contactEmail}
          </a>{" "}
          for access
        </h3>
      </Fragment>
    ),
  };
};

export {
  ourVision,
  faq,
  releaseNotes,
  introductionHowTo,
  toolDescription,
  featureDefinition,
  featureDefinitionMap,
  siteMetrics,
  contactUs,
  exportControl,
  privacyNotice,
  financialAccessRequirements,
};
