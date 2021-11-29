import React from 'react';
import clsx from 'clsx';
import styles from './HomepageFeatures.module.css';

const FeatureList = [
  {
    title: 'Support Matrix',
    
    description: (
      <>
        Delphix supports virtualization for many data platforms and operating systems.
      </>
    ),
  },
  {
    title: 'Release Notes',
    
    description: (
      <>
        This section describes our most recent release. Find descriptions of new features, fixed issues, and support matrices.
      </>
    ),
  },
  {
    title: 'Deployment',
    
    description: (
      <>
        Steps to deploy Delphix on-premise or in the cloud. Requirements for setting up infrastructure such as your network.
      </>
    ),
  },
  {
    title: 'Configuration',
    
    description: (
      <>
        Once the infrastructure is set up, configure your Delphix Engine spanning users, logs, and resource management.
      </>
    ),
  },
  {
    title: 'Upgrade',
    
    description: (
      <>
        Delphix releases new features and updates with each new version. Find the information you'll need for a successful upgrade.
      </>
    ),
  },
  {
    title: 'Security',
    
    description: (
      <>
        Security is a top priority for every enterprise. Learn how Delphix ensures security with your data and a security-first mindset.
      </>
    ),
  },
  {
    title: 'Datasets',
    
    description: (
      <>
        Learn about using virtualization with your datasets. General use cases as well as detailed guides for each data source.
      </>
    ),
  },
  {
    title: 'Data Backup and Recovery',
    
    description: (
      <>
        Securely copy or migrate your datasets and virtual data copies from one Delphix instance to another.
      </>
    ),
  },
  {
    title: 'Self Service',
    
    description: (
      <>
        Self-Service eliminates data related bottlenecks by extending virtual data on demand to application development teams as a self-service.
      </>
    ),
  },
  {
    title: 'Developer\'s Guide',
    
    description: (
      <>
        A reference guide for our CLI and APIs.
      </>
    ),
  },
];

function Feature({title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
