package com.javatechie.spring.ws.api.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;


@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {

	@Override
	protected  void configure(HttpSecurity http) throws Exception {
		http.sessionManagement()
		.sessionCreationPolicy(SessionCreationPolicy.STATELESS).and().cors().and().csrf().disable()
		.authorizeRequests().antMatchers(HttpMethod.POST, "/**").permitAll().and().authorizeRequests();
		http.addFilter(new AuthenticationProcessingFilter()).authorizeRequests().antMatchers("/**").permitAll();
	}
}