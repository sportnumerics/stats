#!/bin/bash

encrypt () {
  echo "Encrypting $1"
  openssl enc -aes-256-cbc -k $SPORTNUMERICS_KEY -a -in $1 -out $2
}

decrypt () {
  openssl enc -aes-256-cbc -k $SPORTNUMERICS_KEY -d -a -in $1 -out $2
}

echoChanges () {
  local tmp="$1.encrypted"
  decrypt $2 $tmp
  git diff --no-index --color-words $tmp $1
  result=$?
  rm $tmp
  return $result
}

confirm () {
    # call with a prompt string or use a default
    read -r -p "${1:-Are you sure? [y/N]} " response
    case $response in
        [yY][eE][sS]|[yY])
            true
            ;;
        *)
            false
            ;;
    esac
}

oneChanged=false
for source in "config/env.sh"
do
  input=$source
  output=$source.enc
  if [ -e $output ]; then
    echoChanges $input $output
    if [ $? -ne 0 ]
    then
      oneChanged=true
      (confirm "Add these changes?" && encrypt $input $output) || exit
    fi
  else
    encrypt $input $output || exit
  fi
done
if [ "$oneChanged" = false ]
then
  echo "No changes to be encrypted, skipping."
fi
