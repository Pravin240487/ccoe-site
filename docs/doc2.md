---
id: doc2
title: Contribute to this site
---

## Create a new Terraform module

Thank you for deciding to share documentation that would help the greater AWS Cloud community at Optum. Please follow instructions on this page to contribute a Terraform module to OACCOE repository: [How to contribute a Terraform module](https://github.optum.com/pages/oaccoe/CCOE-Site/docs/modules/home/#how-to-contribute-a-terraform-module)

## Create a page on this site

In order to add a new page to this site, follow these steps:

1. Create a .md file under the correct directory in the repository: https://github.optum.com/oaccoe/CCOE-Site/tree/master/docs. For e.g., if you want to create a document under the 'How-To' section, then please create the .md document in the 'https://github.optum.com/oaccoe/CCOE-Site/tree/master/docs/howto' directory.

2. Use the following heading format in the file:    

```
---
id: <same as file name without .md>
title: <title of page>
sidebar_label: <sidebar label you'd like to use>
---
```

3. Please ensure that your document follows the structure that is mentioned in the homepage for the section in which you're creating the document.

4. Complete the document and commit to your branch.

5. Update [sidebars.js](https://github.optum.com/oaccoe/CCOE-Site/blob/master/sidebars.js) to add a link to your page in the main section's sidebar

6. Submit a pull request
