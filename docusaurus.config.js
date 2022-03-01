module.exports = {
  title: 'AWS Arena',
  tagline: "Welcome to AWS Arena",
  url: 'https://github.optum.com',
  baseUrl: '/',
  favicon: 'img/favicon.ico',
  organizationName: 'oaccoe',
  projectName: 'CCOE-Site',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  themeConfig: {
    navbar: {
      title: 'AWS Arena',
      logo: {
        alt: 'AWS-Arena',
        src: 'img/logo.svg',
      },
      items: [
        {
          to: 'docs/modules/home',
          activeBasePath: 'docs/modules',
          label: 'Modules',
          position: 'left',
        },
        {
          to: 'docs/education/aws',
          activeBasePath: 'docs/education',
          label: 'Education',
          position: 'left',
        },
        {
          to: 'docs/howto/home',
          activeBasePath: 'docs/howto',
          label: 'How-To',
          position: 'left',
        },
        {
          to: 'docs/solutions/home',
          activeBasePath: 'docs/solutions',
          label: 'Solutions',
          position: 'left',
        },
        {
          to: 'docs/consulting/home',
          activeBasePath: 'docs/consulting',
          label: 'Consulting',
          position: 'left',
        },
        {
          to: 'docs/AWS-Best-Practices/home',
          activeBasePath: 'docs/AWS-Best-Practices',
          label: 'AWS Best Practices',
          position: 'left',
        },
        {
          to: 'docs/About/home',
          activeBasePath: 'docs/About',
          label: 'About',
          position: 'right',
        },
        { to: 'blog', label: 'Blog', position: 'right' },
        ],
    },  
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Style Guide',
              to: 'docs/doc1',
            },
            {
              label: 'Contribute to this site',
              to: 'docs/doc2',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Cloud Operations Office Hours Meeting',
              href: 'https://teams.microsoft.com/l/meetup-join/19%3ameeting_MWJiODI4ZGEtMzA0Ni00YzUyLTkxOTgtMGQxNTg2NjQ3OTg0%40thread.v2/0?context=%7b%22Tid%22%3a%22db05faca-c82a-4b9d-b9c5-0f64b6755421%22%2c%22Oid%22%3a%2218db847b-b1ae-441a-a7a5-8c7f255ed4b3%22%7d',
            },
            
          ],
        },
        {
          title: 'Social',
          items: [
            
            {
              label: 'GitHub',
              href: 'https://github.optum.com/oaccoe/CCOE-Site',
            },
          ],
        },
      ],
      // copyright: `Copyright © ${new Date().getFullYear()} My Project, Inc. Built with Docusaurus.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl:
              'https://github.optum.com/oaccoe/CCOE-Site/edit/master/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
  plugins: [
    [
      require.resolve("@easyops-cn/docusaurus-search-local"),
      {
        hashed: true
      }
    ]
  ]
};
