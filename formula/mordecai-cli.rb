class Mordecai < Formula
  desc "CLI tool for connecting your codebase with your Mordecai account"
  homepage "https://github.com/codeyarduk/mordecai-cli"
  url "https://registry.npmjs.org/mordecai-cli/-/mordecai-cli-0.0.3.tgz"
  sha256 "the_sha256_hash_of_your_npm_package"
  
  depends_on "node"

  def install
    system "npm", "install", *Language::Node.std_npm_install_args(libexec)
    bin.install_symlink Dir["#{libexec}/bin/*"]
  end

  test do
    assert_match "mordecai", shell_output("#{bin}/mordecai --help")
  end
end
