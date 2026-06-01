package pr_checks_test

import data.pr_checks
import rego.v1

# --- deny: mixed dev+prod changes ---

test_deny_when_both_dev_and_prod_changed if {
	result := pr_checks.deny with input as {"changed_files": [
		"deploy/infra/dev/main.tf",
		"deploy/infra/prod/main.tf",
	]}
	count(result) == 1
}

test_deny_message_is_descriptive if {
	result := pr_checks.deny with input as {"changed_files": [
		"deploy/infra/dev/variables.tf",
		"deploy/infra/prod/variables.tf",
	]}
	result == {"PR must not contain changes to both deploy/infra/dev and deploy/infra/prod"}
}

test_deny_with_many_files_in_both_envs if {
	result := pr_checks.deny with input as {"changed_files": [
		"deploy/infra/dev/main.tf",
		"deploy/infra/dev/variables.tf",
		"deploy/infra/prod/main.tf",
		"src/app/app.component.ts",
	]}
	count(result) == 1
}

# --- allow: only dev changes ---

test_allow_when_only_dev_changed if {
	result := pr_checks.deny with input as {"changed_files": [
		"deploy/infra/dev/main.tf",
		"deploy/infra/dev/variables.tf",
	]}
	count(result) == 0
}

# --- allow: only prod changes ---

test_allow_when_only_prod_changed if {
	result := pr_checks.deny with input as {"changed_files": [
		"deploy/infra/prod/main.tf",
	]}
	count(result) == 0
}

# --- allow: no infra changes ---

test_allow_when_no_infra_files_changed if {
	result := pr_checks.deny with input as {"changed_files": [
		"src/app/app.component.ts",
		"src/app/app.routes.ts",
	]}
	count(result) == 0
}

test_allow_when_changed_files_is_empty if {
	result := pr_checks.deny with input as {"changed_files": []}
	count(result) == 0
}

# --- allow: adjacent paths that are not dev/prod ---

test_allow_when_path_only_prefixed_similarly if {
	result := pr_checks.deny with input as {"changed_files": [
		"deploy/infra/dev-extra/main.tf",
		"deploy/infra/prod-extra/main.tf",
	]}
	count(result) == 0
}

# --- allow: app-level deploy changes alongside infra ---

test_allow_when_app_and_single_env_infra if {
	result := pr_checks.deny with input as {"changed_files": [
		"deploy/app/dev/staticwebapp.config.json",
		"deploy/infra/dev/main.tf",
	]}
	count(result) == 0
}
