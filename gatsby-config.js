/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.org/docs/gatsby-config/
 */

module.exports = {
  siteMetadata: {
    title: `Sveti Nikola - Hvar`,
    description: `Hike highest peak of island Hvar - Sveti Nikola.`,
    author: `Matej Meglič`,
  },
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `src`,
        path: `${__dirname}/src/contents`,
      },
    },

    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              // It's important to specify the maxWidth (in pixels) of
              // the content container as this plugin uses this as the
              // base for generating different widths of each image.
              maxWidth: 950,
              loading: "lazy",
              linkImagesToOriginal: true,
            },
          },
        ],
      },
    },
   
    `gatsby-plugin-emotion`,
    {
      resolve: `gatsby-plugin-typography`,
      options: {
        pathToConfigModule: `src/utils/typography`,
      },
    },
    
    `gatsby-transformer-json`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `./public/geojson_nikola.json`,
      },
    },

    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Sveti Nikola - hike Hvar`,
        short_name: `Hike Hvar`,
        start_url: `/`,
        background_color: `#6b37bf`,
        theme_color: `#6b37bf`,
        display: `standalone`,
        icon: `src/contents/misc/web_images/favicon-96x96.png`, 
      },
    },

    `gatsby-plugin-offline`,
    `gatsby-plugin-react-helmet`,
  ],
}