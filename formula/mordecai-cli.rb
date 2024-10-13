class Mordecai < Formula
  desc "CLI tool for connecting your codebase with your Mordecai account"
  homepage "https://github.com/codeyarduk/mordecai-cli"
  url "https://registry.npmjs.org/mordecai-cli/-/mordecai-cli-0.0.4.tgz"
  sha256 "sha512-QhWQIzLcjI50hjilheL9z8Ys3NsH2xQSXDz34OkgFsWarHwuKohM2URK/KdXwzHC04c2oA6aotXqRYhjVdzCVw=="
  
  depends_on "node"

  def install
    system "npm", "install", "-g", *Language::Node.std_npm_install_args(libexec)
    bin.install_symlink Dir["#{libexec}/bin/*"]
  end

  test do
    assert_match "mordecai", shell_output("#{bin}/mordecai --help")
  end
end
