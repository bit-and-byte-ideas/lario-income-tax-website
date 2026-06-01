package pr_checks

import rego.v1

# Deny if a PR touches both dev and prod infra directories simultaneously.
# Mixing dev and prod infra changes in one PR risks applying unreviewed
# prod changes alongside dev-only changes.
deny contains msg if {
	touches_dev
	touches_prod
	msg := "PR must not contain changes to both deploy/infra/dev and deploy/infra/prod"
}

touches_dev if {
	some file in input.changed_files
	startswith(file, "deploy/infra/dev/")
}

touches_prod if {
	some file in input.changed_files
	startswith(file, "deploy/infra/prod/")
}
