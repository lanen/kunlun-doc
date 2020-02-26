/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

class Footer extends React.Component {
  docUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl;
    const docsUrl = this.props.config.docsUrl;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
    const langPart = `${language ? `${language}/` : ''}`;
    return `${baseUrl}${docsPart}${langPart}${doc}`;
  }

  pageUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl;
    return baseUrl + (language ? `${language}/` : '') + doc;
  }

  render() {
    const baseUrl = this.props.config.baseUrl;
    return (
      <footer className="nav-footer" id="footer">
        <section className="sitemap">
          <a href={this.props.config.baseUrl} className="nav-home">
            {this.props.config.footerIcon && (
              <img
                src={this.props.config.baseUrl + this.props.config.footerIcon}
                alt={this.props.config.title}
                width="66"
                height="58"
              />
            )}
          </a>
          <div>
            <h5>Staring</h5>
            <a href={this.docUrl('starling-intro.html', this.props.language)}>
              STL介绍
            </a>
            <a href={this.docUrl('starling-quick-start.html', this.props.language)}>
              快速入门
            </a>
            <a href="https://gitlab.iquantex.com/arch/starling" target="_blank">项目地址</a>
          </div>
          <div>
            <h5>API Gateway</h5>
            <a href={this.docUrl('api-gateway-intro.html', this.props.language)}>
              SPI介绍
            </a>
            <a href={this.docUrl('api-gateway-roadmap.html', this.props.language)}>
              Roadmap
            </a>
          </div>
          <div>
            <h5>其他</h5>
            <a href={this.pageUrl('help.html', this.props.language)}>帮助</a>
          </div>
        </section>

        <a
          href={`${baseUrl}`}
          rel="noreferrer noopener"
          className="fbOpenSource">
          <img
            src={`${this.props.config.baseUrl}img/oss_logo.png`}
            alt="Facebook Open Source"
            width="170"
            height="45"
          />
        </a>
        <section className="copyright">{this.props.config.copyright}</section>
      </footer>
    );
  }
}

module.exports = Footer;
