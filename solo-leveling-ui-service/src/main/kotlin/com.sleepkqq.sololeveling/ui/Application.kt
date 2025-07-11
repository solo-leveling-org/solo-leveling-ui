package com.sleepkqq.sololeveling.ui

import com.vaadin.flow.component.page.AppShellConfigurator
import com.vaadin.flow.component.page.Push
import com.vaadin.flow.theme.Theme
import org.springframework.boot.SpringApplication
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer

@Push
@SpringBootApplication
@Theme(value = "solo-leveling")
class Application : SpringBootServletInitializer(), AppShellConfigurator {

	companion object {
		@JvmStatic
		fun main(args: Array<String>) {
			SpringApplication.run(Application::class.java, *args)
		}
	}
}
