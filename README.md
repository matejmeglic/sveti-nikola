Repo for Gremo v Mongolijo - Slovenia - GO-HELP - Mongolia Charity Rally 2014 - blog in Gatsby

- layout provides navigation (SLO, EN, ... <-- old 2014 website content)
- two lang support (* = SLO or EN)
- * .js pages provide links to blog posts (ex wordpress articles date DESC)
- all_* .js pages provide full story on a single page (date ASC)
- each article is confined in its own .md file, files reside in src/contents/
- .pdf files in /old are referenced directly from GH as that was easier to implement (lazy_boy)
- two createPage processes are run at build in gatsby-node.js to provide accurate previous_ and next_post links for both languages, then graphQL is used to reference correct lang
- images are in /src/images/ folder and are being resized at build to 900px