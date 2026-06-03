#!/bin/bash

# Usage:
#   bash scripts/create_domain.sh "" ability
#   bash scripts/create_domain.sh "/pokemon" ability

set -e

SUBDOMAIN_ARG=$1
NAME_ARG=$2

if [ -z "$NAME_ARG" ]; then
  echo "Error: name is required. Usage: make domain-service name=trainer [subdomain=encounter]"
  exit 1
fi


DOMAIN_CLASS_NAME=$(echo "$NAME_ARG" | awk -F'[_-]' '{for (i=1; i<=NF; i++) printf toupper(substr($i,1,1)) tolower(substr($i,2)); print ""}')
DOMAIN_FUNCTION_NAME=$(echo "$DOMAIN_CLASS_NAME" | awk '{print tolower($0)}')
SUBDOMAIN=${SUBDOMAIN_ARG#/}
if [ -n "$SUBDOMAIN" ]; then
  DOMAIN_RELATIVE_PATH="$NAME_ARG/$SUBDOMAIN"
  SUBDOMAIN_CLASS_NAME=$(echo "$SUBDOMAIN" | awk -F'[_-]' '{for (i=1; i<=NF; i++) printf toupper(substr($i,1,1)) tolower(substr($i,2)); print ""}')
  CLASS_NAME="${DOMAIN_CLASS_NAME}${SUBDOMAIN_CLASS_NAME}"
  FUNCTION_NAME="${DOMAIN_FUNCTION_NAME}${SUBDOMAIN_CLASS_NAME}"
  DOMAIN_TEST_NAME="${DOMAIN_CLASS_NAME} ${SUBDOMAIN_CLASS_NAME}"
else
  DOMAIN_RELATIVE_PATH="$NAME_ARG"
  CLASS_NAME="${DOMAIN_CLASS_NAME}"
  FUNCTION_NAME="${DOMAIN_FUNCTION_NAME}"
  DOMAIN_TEST_NAME="${DOMAIN_CLASS_NAME}"
fi

DOMAIN_SERVICE="${CLASS_NAME}Service"
FUNCTION_DOMAIN_SERVICE="${FUNCTION_NAME}Service"
DOMAIN_BFF_SERVICE="${CLASS_NAME}BffService"
FUNCTION_DOMAIN_BFF_SERVICE="${FUNCTION_NAME}BffService"
DOMAIN_TYPE="T${CLASS_NAME}"

TARGET="app/ui/features/${DOMAIN_RELATIVE_PATH}/services"

DOMAIN_TRANSLATE=${DOMAIN_RELATIVE_PATH//\//.}

escape_sed_replacement() {
  printf '%s' "$1" | sed -e 's/[&|\\]/\\&/g'
}

ESC_DOMAIN_SERVICE=$(escape_sed_replacement "$DOMAIN_SERVICE")
ESC_FUNCTION_DOMAIN_SERVICE=$(escape_sed_replacement "$FUNCTION_DOMAIN_SERVICE")
ESC_DOMAIN_RELATIVE_PATH=$(escape_sed_replacement "$DOMAIN_RELATIVE_PATH")
ESC_DOMAIN_TYPE=$(escape_sed_replacement "$DOMAIN_TYPE")
ESC_DOMAIN_TYPE_FILTERS=$(escape_sed_replacement "${DOMAIN_TYPE}Filters")
ESC_DOMAIN_BFF_SERVICE=$(escape_sed_replacement "$DOMAIN_BFF_SERVICE")
ESC_FUNCTION_DOMAIN_BFF_SERVICE=$(escape_sed_replacement "$FUNCTION_DOMAIN_BFF_SERVICE")
ESC_DOMAIN_TRANSLATE=$(escape_sed_replacement "$DOMAIN_TRANSLATE")
ESC_DOMAIN_TEST_NAME=$(escape_sed_replacement "$DOMAIN_TEST_NAME")

FILES=(bffService bffServiceSpec bffServiceIndex service serviceSpec serviceIndex index)


if [ -d "$TARGET" ]; then
  echo "Error: domain '$DOMAIN_RELATIVE_PATH' already exists at $TARGET"
  exit 1
fi

for FILE in "${FILES[@]}"; do
  TEMPLATE_PATH="scripts/templates/services/${FILE}.ts"
  if [ ! -f "$TEMPLATE_PATH" ]; then
    echo "Error: template file '$TEMPLATE_PATH' not found"
    exit 1
  fi
done

mkdir -p "$TARGET"
mkdir -p "$TARGET/service"
mkdir -p "$TARGET/bff-service"

cleanup_on_error() {
  if [ -d "$TARGET" ]; then
    rm -rf "$TARGET"
  fi
}

trap cleanup_on_error ERR

for FILE in "${FILES[@]}"; do
  if [ "$FILE" == "service" ]; then
    PATH_ORIGIN="scripts/templates/services/service.ts"
    PATH_DESTINATION="$TARGET/service/service.ts"
  elif [ "$FILE" == "serviceSpec" ]; then
      PATH_ORIGIN="scripts/templates/services/serviceSpec.ts"
      PATH_DESTINATION="$TARGET/service/service.spec.ts"
  elif [ "$FILE" == "serviceIndex" ]; then
    PATH_ORIGIN="scripts/templates/services/serviceIndex.ts"
    PATH_DESTINATION="$TARGET/service/index.ts"
  elif [ "$FILE" == "bffService" ]; then
    PATH_ORIGIN="scripts/templates/services/bffService.ts"
    PATH_DESTINATION="$TARGET/bff-service/bffService.ts"
  elif [ "$FILE" == "bffServiceSpec" ]; then
      PATH_ORIGIN="scripts/templates/services/bffServiceSpec.ts"
      PATH_DESTINATION="$TARGET/bff-service/bffService.spec.ts"
  elif [ "$FILE" == "bffServiceIndex" ]; then
    PATH_ORIGIN="scripts/templates/services/bffServiceIndex.ts"
    PATH_DESTINATION="$TARGET/bff-service/index.ts"
  else
    PATH_ORIGIN="scripts/templates/services/index.ts"
    PATH_DESTINATION="$TARGET/index.ts"
  fi
  sed \
      -e "s|__DOMAIN_SERVICE__|$ESC_DOMAIN_SERVICE|g" \
      -e "s|__DOMAIN_TEST_NAME__|$ESC_DOMAIN_TEST_NAME|g" \
      -e "s|__DOMAIN_FUNCTION_SERVICE__|$ESC_FUNCTION_DOMAIN_SERVICE|g" \
      -e "s|__DOMAIN_PATH__|$ESC_DOMAIN_RELATIVE_PATH|g" \
      -e "s|__DOMAIN_TYPE__FILTERS__|$ESC_DOMAIN_TYPE_FILTERS|g" \
      -e "s|__DOMAIN_TYPE__|$ESC_DOMAIN_TYPE|g" \
      -e "s|__DOMAIN_BFF_SERVICE__|$ESC_DOMAIN_BFF_SERVICE|g" \
      -e "s|__FUNCTION_DOMAIN_BFF_SERVICE__|$ESC_FUNCTION_DOMAIN_BFF_SERVICE|g" \
      -e "s|__DOMAIN_TRANSLATE__|$ESC_DOMAIN_TRANSLATE|g" \
      "${PATH_ORIGIN}" > "${PATH_DESTINATION}"
done

trap - ERR

echo "✅ Domain '$DOMAIN_RELATIVE_PATH' created at $TARGET"
echo "   → $TARGET/index.ts"
echo "   → $TARGET/service/service.ts"
echo "   → $TARGET/service/index.ts"
echo "   → $TARGET/bff-service/bffService.ts"
echo "   → $TARGET/bff-service/index.ts"
echo ""
echo "⚠️  Lembre-se de:"
echo "   1. Registrar o index na raiz do modulo (app/ui/features/${DOMAIN_RELATIVE_PATH}/index.ts)"
