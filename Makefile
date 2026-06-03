domain-service:
	@if [ -z "$(name)" ]; then \
		echo "Error: name variable is required. Usage:  make domain-service name=trainer [subdomain=encounter]"; \
		exit 1; \
	fi
	bash scripts/create_domain_service.sh "$(sub)" "$(name)"
