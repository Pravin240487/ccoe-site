import React from 'react';
import classnames from 'classnames';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

const features = [
  {
    title: <>Shared Modules</>,
    description: (
      <>
        Shared Modules are a finite set of managed/supported Terraform modules to be used within Optum Analytics and beyond.    
      </>
    ),
  },
  {
    title: <>Best Practices</>,
    description: (
      <>
        We promote AWS Cloud Best Practices through reusable cloud assets like SaaS, code and documentation  
      </>
    ),
  },
  {
    title: <>Consulting Engagements</>,
    description: (
      <>
        We understand that teams may not always have the bandwitdth or specific AWS skillset to build capabilibities on AWS and we encourage you to use our Consulting Services in such situations
      </>
    ),
  },
];

function Feature({imageUrl, title, description}) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div className={classnames('col col--4', styles.feature)}>
      {imgUrl && (
        <div className="text--center">
          <img className={styles.featureImage} src={imgUrl} alt={title} />
        </div>
      )}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

function Home() {
  const context = useDocusaurusContext();
  const {siteConfig = {}} = context;
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <header className={classnames('hero hero--primary', styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title">{siteConfig.title}</h1>
          <p>AWS Arena strives to create an environment that enables product teams across Optum build capabilities on AWS Cloud. Through this centralized community of cloud engineers we provide reusable features, AWS Best Practices and Consulting services to prevent information silos, reduce developer effort and increase productivity among engineering teams.</p>
        </div>
      </header>
      <main>
        {features && features.length && (
          <section className={styles.features}>
            <div className="container">
              <div className="row">
                {features.map((props, idx) => (
                  <Feature key={idx} {...props} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}

export default Home;
