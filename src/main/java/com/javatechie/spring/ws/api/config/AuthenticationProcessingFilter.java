package com.javatechie.spring.ws.api.config;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.preauth.AbstractPreAuthenticatedProcessingFilter;

import io.jsonwebtoken.Jwts;


public class AuthenticationProcessingFilter extends AbstractPreAuthenticatedProcessingFilter {

	public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {


		HttpServletRequest httpRequest = (HttpServletRequest) servletRequest;
		String token = httpRequest.getHeader("Authorization");
		
		String user = Jwts.parser().setSigningKey("AdminAMMA")
				.parseClaimsJws(token.replace("Bearer", "")).getBody().getSubject();

		String mT = (String) Jwts.parser().setSigningKey("AdminAMMA")
				.parseClaimsJws(token.replace("Bearer", "")).getBody().get("mT");

		if(user != null && mT != null) {
			List<GrantedAuthority> authorities = new ArrayList<>();
			authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
			UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(user, user, authorities);
			SecurityContextHolder.getContext().setAuthentication(auth);
		}

		filterChain.doFilter(servletRequest, servletResponse);
	}

	@Override
	protected Object getPreAuthenticatedPrincipal(HttpServletRequest httpServletRequest) {
		return null;
	}

	@Override
	protected Object getPreAuthenticatedCredentials(HttpServletRequest httpServletRequest) {
		return null;
	}
}