function onfail() {
  echo -e "\033[0;31mError: Decryption failed. Have you exported the decryption key in the SPORTNUMERICS_KEY environment variable?\033[0m"
  exit 1
}

set -e
trap onfail ERR

for source in "config/env.sh"
do
  openssl enc -aes-256-cbc -k $SPORTNUMERICS_KEY -d -a -in $source.enc -out $source
done
